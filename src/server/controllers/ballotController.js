const { createHash } = require('crypto');
const { models } = require('../models');

const config = require('../config.json');

module.exports.registerVote = async (req, res) => {
	const { ballotId } = req.params;
	const { stars } = req.body;

	try {
		const ballot = await models.Ballot.findByPk(ballotId);

		if (ballot.academicYear !== config.server.academicYear) return res.status(409).json({ message: 'La votación seleccionada no pertenece al periodo académico activo.' });
		if (ballot.degreeId !== req.session.user.degreeId) return res.status(403).json({ message: 'El usuario no pertenece a la titulación de la votación.' });

		await models.Vote.create({
			id: createHash('sha256').update(stars + req.session.user.id + ballotId).digest('hex'),
			ballotId,
			stars,
		});

		await models.Register.create({
			ballotId,
			userId: req.session.user.id,
		});

		return res.status(200).json({ message: 'Voto registrado.' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al registrar el voto.' });
	}
};
