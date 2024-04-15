/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { models, sequelize } = require('../models');

const config = require('../config.json');

module.exports.getAdminData = (req, res, next) => {
	res.header('Content-Type', 'application/json');
	res.status(200).json({ userinfo: req.session.user });
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
		const { degreeId, academicYear } = req.params;

		const professorsBySubject = {};

		const currentSubjects = await models.Subject.findAll({ where: { degreeId } });

		const currentBallots = await models.Ballot.findAll({ where: { degreeId, academicYear } });

		// This trick makes the function await until loop finishes before sending response to the client.
		await Promise.all(currentSubjects.map(async (subject) => {
			let semesterCount = subject.semester === '0' ? 2 : 0;
			do {
				const apiResponseGauss = await fetch(api.subjectGuides
					.split('{academicYear}')
					.join(academicYear)
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

				// This map checks if a ballot for this subject and professor exists within the database.
				const subjectProfessors = subjectGuide.profesores.map((professor) => {
					if (professor !== null && professor.length !== 0) {
						const professorId = professor.email.split('@')[0];

						const ballot = currentBallots.find(b => b.subjectId === subject.id
								&& b.professorId === professorId);

						if (!ballot) {
							return professor;
						}
					}
					return undefined;
				});

				// This filter gets rid of all "undefined" professors from the previous step.
				const professorsWithNoBallot = subjectProfessors.filter(professor => professor !== undefined);

				professorsBySubject[subject.id] = professorsWithNoBallot;

				// eslint-disable-next-line no-plusplus
				semesterCount--;
			} while (semesterCount > 0);
		}));

		// This trick loads all the professors into a dictionary with their username as key and their subjects as an array.
		const newProfesores = Object.entries(professorsBySubject).reduce((acc, [subjectId, subjects]) => {
			subjects.forEach((subject) => {
				const id = subject.email.split('@')[0];
				if (!acc[id]) {
					acc[id] = {
						id,
						name: `${subject.nombre} ${subject.apellidos}`,
						email: subject.email,
						subjectId: [parseInt(subjectId, 10)],
					};
				} else {
					acc[id].subjectId.push(parseInt(subjectId, 10));
				}
			});
			return acc;
		}, {});

		res.status(200).send(newProfesores);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al obtener los datos de los profesores.' });
	}
};

module.exports.importProfessors = async (req, res, next) => {
	try {
		const { degreeId, academicYear } = req.params;
		const { missingProfessors } = req.body;

		const currentProfessors = await models.Professor.findAll();
		const currentBallots = await models.Ballot.findAll({ where: { degreeId, academicYear } });

		Object.values(missingProfessors).forEach((professor) => {
			if (!currentProfessors.find(p => p.id === professor.id)) {
				models.Professor.create({
					id: professor.id, name: professor.name, email: professor.email, state: 'active',
				});
			}

			professor.subjectId.forEach((subject) => {
				if (!currentBallots.find(b => b.professorId === professor.id && b.subjectId === subject)) {
					models.Ballot.create({
						academicYear, professorId: professor.id, subjectId: subject, degreeId,
					});
				}
			});
		});

		res.status(200).json({ message: 'Profesores importados correctamente.' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al importar los datos de los profesores.' });
	}
};

module.exports.getProfessors = async (req, res, next) => {
	try {
		const currentProfessors = await models.Professor.findAll({ raw: true });

		res.status(200).json(currentProfessors);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener los profesores.' });
	}
};
