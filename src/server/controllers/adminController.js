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

module.exports.fetchSubjects = async (req, res, next) => {
	try {
		const { api } = config;

		const currentSubjects = await models.Subject.findAll();
		const currentSubjectsIDs = currentSubjects.map(e => e.id);

		const apiResponse = await fetch(api.baseURL + api.subjects.split('{degreeId}').join(req.params.degreeId));
		const newSubjects = await apiResponse.json();

		Object.values(newSubjects).forEach(((subject) => { if (subject.departamentos.length === 0 || subject.curso === '') delete newSubjects[subject.codigo]; }));

		const missingIDs = Object.keys(newSubjects).filter(codigo => !currentSubjectsIDs.includes(parseInt(codigo, 10)));

		const missingSubjects = [];
		missingIDs.forEach((id) => {
			missingSubjects.push(newSubjects[id]);
		});

		res.status(200).json(missingSubjects);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener las asignaturas.' });
	}
};

module.exports.importSubjects = async (req, res, next) => {
	const { missingSubjects } = req.body;

	try {
		missingSubjects.forEach(subject => models.Subject.create({
			id: subject.codigo, name: subject.nombre, year: subject.curso, semester: Object.keys(subject.imparticion).length === 2 ? '0' : Object.keys(subject.imparticion)[0][0], degreeId: req.params.degreeId,
		}));
		res.status(200).json({ message: 'Asignaturas importadas correctamente.' });
	} catch (error) {
		res.status(500).json({ message: 'Error al importar las asignaturas.' });
	}
};

module.exports.fetchProfessors = async (req, res, next) => {
	try {
		const { api } = config;

		const professorsBySubject = {};

		const currentSubjects = await models.Subject.findAll();

		const currentProfessors = await models.Professor.findAll();
		const currentProfessorsIDs = currentProfessors.map(e => e.id);

		currentSubjects.forEach(async (subject) => {
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
				console.log(professorsBySubject);

				// eslint-disable-next-line no-plusplus
				semesterCount--;
			} while (semesterCount > 0);
		});

		res.status(200).json(professorsBySubject);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al obtener las asignaturas.' });
	}
};
