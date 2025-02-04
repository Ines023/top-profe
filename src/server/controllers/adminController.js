/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { createHash } = require('crypto');
const { models, sequelize } = require('../models');

const config = require('../config.json');

module.exports.getDegrees = async (req, res, next) => {
	try {
		const degrees = await models.Degree.findAll();
		res.status(200).send(degrees);
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

		Object.values(fetchedSubjects).forEach(((subject) => { if (subject.ofertada === 'N' || subject.departamentos.length === 0 || subject.curso === '' || !('1S' in subject.imparticion || '2S' in subject.imparticion)) delete fetchedSubjects[subject.codigo]; }));

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

		const missingGuides = [];

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
					missingGuides.push({
						id: subject.id,
						semester: subject.semester === '0' ? '1' : subject.semester,
						name: subject.name,
						year: subject.year,
					});
					if (subject.semester === '0') {
						missingGuides.push({
							id: subject.id,
							semester: '2',
							name: subject.name,
							year: subject.year,
						});
					}
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
		const newProfessors = Object.entries(professorsBySubject).reduce((acc, [subjectId, subjects]) => {
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

		res.status(200).json({ newProfessors, missingGuides });
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

		Object.values(missingProfessors).forEach(async (professor) => {
			if (!currentProfessors.find(p => p.id === professor.id)) {
				await models.Professor.create({
					id: professor.id, hash: createHash('sha256').update(professor.id).digest('hex'), name: professor.name, email: professor.email, status: 'active',
				});
			}

			professor.subjectId.forEach(async (subject) => {
				if (!currentBallots.find(b => b.professorId.trim().toLowerCase() === professor.id.trim().toLowerCase() && parseInt(b.subjectId, 10) === parseInt(subject, 10))) {
					await models.Ballot.create({
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

module.exports.updateProfessor = async (req, res, next) => {
	const { professor } = req.body;
	try {
		const currrentProfessor = await models.Professor.findByPk(professor.id);

		if (!currrentProfessor) return res.status(404).json({ message: 'Profesor no encontrado.' });

		const {
			id, name, status,
		} = professor;

		currrentProfessor.id = id;
		currrentProfessor.name = name;
		currrentProfessor.status = status;

		await currrentProfessor.save();

		return res.status(200).json({ message: 'Profesor actualizado.' });
	} catch (error) {
		return res.status(500).json({ message: 'Error al actualizar el profesor.' });
	}
};

module.exports.getUsers = async (req, res, next) => {
	try {
		const currentUsers = await models.User.findAll({ raw: true });

		return res.status(200).json(currentUsers);
	} catch (error) {
		return res.status(500).json({ message: 'Error al obtener los usuarios.' });
	}
};

module.exports.updateUser = async (req, res, next) => {
	const { user } = req.body;
	try {
		const currentUser = await models.User.findByPk(user.id);

		if (!currentUser) return res.status(404).json({ message: 'Usuario no encontrado.' });

		const {
			id, type, degreeId, active, admin, excluded,
		} = user;

		if (id === req.session.user.id && (!!+admin !== currentUser.admin || !!+excluded !== currentUser.excluded)) return res.status(409).json({ message: 'No puedes modificar este parámetro para tu propio usuario.' });

		currentUser.id = id;
		currentUser.type = type;
		currentUser.degreeId = degreeId;
		currentUser.active = active;
		currentUser.admin = admin;
		currentUser.excluded = excluded;

		await currentUser.save();

		return res.status(200).json({ message: 'Usuario actualizado.' });
	} catch (error) {
		return res.status(500).json({ message: 'Error al actualizar el usuario.' });
	}
};
