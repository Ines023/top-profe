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

		const missingIDs = Object.keys(newSubjects).filter(id => !currentSubjectsIDs.includes(id));

		const missingSubjects = [];
		missingIDs.forEach((id) => {
			missingSubjects.push(newSubjects[id]);
		});

		req.session.missingSubjects = missingSubjects;
		req.session.save();

		res.status(200).json(missingSubjects);
	} catch (error) {
		res.status(500).json({ message: 'Error al obtener las asignaturas.' });
	}
};
