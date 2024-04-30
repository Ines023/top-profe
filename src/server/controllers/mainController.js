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
	res.header('Content-Type', 'application/json');
	res.status(200).json(req.session.user);
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

module.exports.setOptOut = async (req, res) => {
	try {
		const professor = await models.Professor.findByPk(req.session.user.id);

		if (!professor) return res.status(404).json({ message: 'El profesor especificado no existe.' });
		if (professor.status === 'excluded') return res.status(409).json({ message: 'El profesor especificado ya tiene ocultas sus valoraciones.' });

		const user = await models.User.findByPk(req.session.user.id);

		user.excluded = true;
		professor.status = 'excluded';
		await user.save();
		await professor.save();

		return res.status(200).json({ message: 'Profesor actualizado con éxito.' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al recuperar el profesor.' });
	}
};
