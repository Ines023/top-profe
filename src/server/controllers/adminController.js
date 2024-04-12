/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
const { models, sequelize } = require('../models');

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
