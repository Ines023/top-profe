const { models } = require('../models');

const config = require('../config.json');

module.exports.getDegrees = async (req, res) => {
	try {
		const degrees = await models.Degree.findAll({
			include: [{
				model: models.Ballot,
				as: 'ballot',
				required: true,
				attributes: ['id'],
				where: {
					academicYear: config.server.academicYear,
				},
			}],
		});
		res.status(200).send(degrees);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al obtener las titulaciones.' });
	}
};

module.exports.getUser = async (req, res) => {
	try {
		const registeredUser = await models.User.findByPk(req.session.user.id, { raw: true });

		res.status(200).json(registeredUser);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al recuperar el usuario.' });
	}
};

module.exports.activateUser = async (req, res) => {
	try {
		const user = await models.User.findByPk(req.session.user.id);

		user.active = true;
		await user.save();

		req.session.user = user;

		return res.status(200).json({ message: 'Usuario actualizado con éxito.' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al recuperar el usuario.' });
	}
};

module.exports.setUserDegree = async (req, res) => {
	const { degreeId } = req.body;
	try {
		const degree = await models.Degree.findByPk(degreeId);

		if (!degree) return res.status(409).json({ message: 'La titulación seleccionada no existe.' });

		const user = await models.User.findByPk(req.session.user.id);

		user.degreeId = degreeId;
		await user.save();

		req.session.user = user;

		return res.status(200).json({ message: 'Usuario actualizado con éxito.' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al recuperar el usuario.' });
	}
};
