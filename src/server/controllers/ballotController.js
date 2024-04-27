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

module.exports.getVote = async (req, res) => {
	const { voteId } = req.params;

	try {
		const vote = await models.Ballot.findByPk(voteId, {
			include: [{
				model: models.Ballot,
				as: 'ballot',
			}],
		});

		return res.status(200).json(vote);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al recuperar el voto.' });
	}
};


module.exports.deleteVote = async (req, res) => {
	const { voteId } = req.params;

	try {
		const vote = await models.Ballot.findByPk(voteId, {
			include: [{
				model: models.Ballot,
				as: 'ballot',
			}],
		});

		const register = await models.Register.findOne({
			where: {
				ballotId: vote.ballot.id,
				userId: req.session.user.id,
			},
		});

		if (vote.ballot.academicYear !== config.server.academicYear) res.status(409).json({ message: 'La votación seleccionada no pertenece al periodo académico activo.' });

		await vote.destroy();
		await register.destroy();

		return res.status(200);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al eliminar el voto.' });
	}
};
