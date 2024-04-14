/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { models, sequelize } = require('../models');

const config = require('../config.json');

module.exports.getAdminData = (req, res, next) => {
	res.sendStatus(200);
};

module.exports.getDegrees = async (req, res, next) => {
	try {
		const degrees = await models.Degree.findAll();
		res.send(degrees);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener las titulaciones.' });
	}
};

module.exports.getDegree = async (req, res, next) => {
	const { degreeId } = req.params;

	try {
		const degree = await models.Degree.findByPk(degreeId);
		res.status(200).send(degree);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener la titulación.' });
	}
};

module.exports.getSubjects = async (req, res, next) => {
	const { degreeId } = req.params;

	try {
		const currentSubjects = await models.Subject.findAll({ where: { degreeId }, raw: true });

		console.log(`Asignaturas recuperadas: ${currentSubjects}`);

		res.status(200).json(currentSubjects);
	} catch (error) {
		res.status(500).json({ message: `Error al obtener las asignaturas de ${degreeId}.` });
	}
};

module.exports.getSubject = async (req, res, next) => {
	const { subjectId } = req.params;

	try {
		const subject = await models.Subject.findByPk(subjectId);
		res.status(200).send(subject);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener la asignatura.' });
	}
};

module.exports.fetchSubjects = async (req, res, next) => {
	try {
		const { api } = config;

		const currentSubjects = await models.Subject.findAll();
		const currentSubjectsIDs = currentSubjects.map(e => e.id);

		const apiResponse = await fetch(api.baseURL + api.subjects.split('{degreeId}').join(req.params.degreeId));
		const fetchedSubjects = await apiResponse.json();

		Object.values(fetchedSubjects).forEach(((subject) => { if (subject.departamentos.length === 0 || subject.curso === '') delete fetchedSubjects[subject.codigo]; }));

		const missingIDs = Object.keys(fetchedSubjects).filter(codigo => !currentSubjectsIDs.includes(parseInt(codigo, 10)));

		const missingSubjects = [];
		missingIDs.forEach((codigo) => {
			missingSubjects.push(fetchedSubjects[codigo]);
		});

		const newSubjects = missingSubjects.map(subject => ({
			id: subject.codigo,
			name: subject.nombre,
			year: subject.curso,
			semester: subject.imparticion,
		}));

		res.status(200).json(newSubjects);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener las asignaturas.' });
	}
};

module.exports.importSubjects = async (req, res, next) => {
	const { missingSubjects } = req.body;

	try {
		missingSubjects.forEach(subject => models.Subject.create({
			id: subject.id, name: subject.name, year: subject.year, semester: Object.keys(subject.semester).length === 2 ? '0' : Object.keys(subject.semester)[0][0], degreeId: req.params.degreeId,
		}));
		res.status(200).json({ message: 'Asignaturas importadas correctamente.' });
	} catch (error) {
		res.status(500).json({ message: 'Error al importar las asignaturas.' });
	}
};

module.exports.fetchProfessors = async (req, res, next) => {
	try {
		const { api } = config;
		const { degreeId } = req.params;

		const professorsBySubject = {};

		const currentSubjects = await models.Subject.findAll({ where: { degreeId } });

		const currentProfessors = await models.Professor.findAll();
		const currentProfessorsIDs = currentProfessors.map(e => e.id);

		// This trick makes the function await until loop finishes before sending response to the client.
		await Promise.all(currentSubjects.map(async (subject) => {
			let semesterCount = subject.semester === '0' ? 2 : 0;
			do {
				const apiResponseGauss = await fetch(api.subjectGuides
					.split('{academic_year}')
					.join(req.params.academic_year)
					.split('{semester}')
					.join(semesterCount === 0 ? subject.semester : semesterCount)
					.split('{degreeId}')
					.join(subject.degreeId)
					.split('{subjectId}')
					.join(subject.id));

				let subjectGuide = null;
				try {
					subjectGuide = await apiResponseGauss.json();
				} catch (error) {
					console.log(`No se ha encontrado guía para: ${subject.id}`);
					break;
				}

				const subjectProfessors = [];

				subjectGuide.profesores.forEach((professor) => { if (professor !== null && professor.length !== 0 && !(professor.email.split('@')[0] in currentProfessorsIDs)) subjectProfessors.push(professor); });

				professorsBySubject[subject.id] = subjectProfessors;

				// eslint-disable-next-line no-plusplus
				semesterCount--;
			} while (semesterCount > 0);
		}));

		const newProfesores = Object.entries(professorsBySubject).map(([subjectId, subjects]) => subjects.map(subject => ({
			id: subject.email.split('@')[0], // Use the email prefix as ID
			name: `${subject.nombre} ${subject.apellidos}`,
			email: subject.email,
			subjectId: parseInt(subjectId, 10),
		}))).flat();

		res.status(200).send(newProfesores);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al obtener los datos de los profesores.' });
	}
};
