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
			id: subject.codigo, name: subject.nombre, year: subject.curso, degreeId: req.params.degreeId,
		}));
		res.status(200);
	} catch (error) {
		res.status(500).json({ message: 'Error al importar las asignaturas.' });
	}
};
