/* eslint-disable max-len */
const { createHash, randomBytes } = require('crypto');
const fs = require('fs');
const path = require('path');
const { models, Sequelize } = require('../models');
const { sendVoteMail } = require('../mail');

const config = require('../config.json');

function prepareMailTemplate(professorName, subjectName, subjectId, stars, voteId, voteKey) {
	const data = fs.readFileSync(path.resolve(__dirname, '../../client/mail/mailTemplate.html'), 'utf8');
	if (!data) {
		console.error('Error al leer el archivo.');
		return null;
	}

	const values = {
		serverUrl: config.server.url,
		professorName,
		subjectName,
		subjectId,
		voteId,
		voteKey,
		currentYear: new Date().getFullYear(),
	};

	for (let i = 1; i <= 5; i++) {
		values[`htmlStar${i}`] = stars >= i ? '100%' : '0%';
		values[`textStar${i}`] = stars >= i ? '★' : '☆';
	}

	const regex = /\${(.*?)}/g;

	const result = data.replace(regex, (match, p1) => values[p1.trim()] || match);
	return result;
}

module.exports.registerVote = async (req, res) => {
	const { ballotId } = req.params;
	const { stars } = req.body;

	const parsedStars = parseInt(stars, 10);

	if (config.server.disableVotes && !req.session.user.admin) return res.status(403).json({ message: 'Ya no es posible emitir votos.' });

	try {
		const ballot = await models.Ballot.findByPk(ballotId, {
			include: [{
				model: models.Professor,
				as: 'professor',
			},
			{
				model: models.Subject,
				as: 'subject',
			}],
		});

		if (parsedStars < 1 || parsedStars > 5) return res.status(400).json({ message: 'El valor de la votación no es válido.' });
		if (ballot.academicYear !== config.server.academicYear) return res.status(409).json({ message: 'La votación seleccionada no pertenece al periodo académico activo.' });
		if (ballot.degreeId !== req.session.user.degreeId) return res.status(403).json({ message: 'El usuario no pertenece a la titulación de la votación.' });

		const existingRegister = await models.Register.findOne({
			where: {
				userId: req.session.user.id,
				ballotId: ballot.id,
			},
		});

		if (existingRegister) return res.status(409).json({ message: 'El usuario ya ha emitido un voto para esta votación.' });

		const salt = randomBytes(16).toString('hex');

		const vote = await models.Vote.create({
			id: createHash('sha256').update(parsedStars + req.session.user.id + ballotId + salt).digest('hex'),
			ballotId,
			stars: parsedStars,
		});

		const register = models.Register.create({
			ballotId,
			userId: req.session.user.id,
		});

		const mailContents = await prepareMailTemplate(ballot.professor.name, ballot.subject.name, ballot.subject.id, stars, vote.id, salt);
		if (!mailContents) throw new Error('Error al modificar la plantilla del correo de confirmación.');

		if (!await sendVoteMail(req.session.user.email, mailContents)) {
			vote.destroy();
			register.destroy();
			return res.status(503).json({ message: 'Error al enviar el correo de confirmación.' });
		}

		return res.status(200).json({ message: 'Voto registrado.', voteURL: `${config.server.url}/votes/${vote.id}?key=${salt}` });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al registrar el voto.' });
	}
};

module.exports.getVote = async (req, res) => {
	const { voteId } = req.params;
	const { key } = req.query;

	try {
		const vote = await models.Vote.findByPk(voteId, {
			attributes: ['id', 'stars'],
			include: [{
				model: models.Ballot,
				as: 'ballot',
				attributes: ['id',
					[Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('stars')), 2), 'avg'],
					[Sequelize.fn('COUNT', Sequelize.col('stars')), 'count'],
				],
				include: [{
					model: models.Professor,
					as: 'professor',
				},
				{
					model: models.Subject,
					as: 'subject',
				}],
			}],
		});

		if (!vote.id) return res.status(404).json({ message: 'El voto especificado no existe.' });

		if (createHash('sha256').update(vote.stars + req.session.user.id + vote.ballot.id + key).digest('hex') !== vote.id) return res.status(403).json({ message: 'No tienes permiso para visualizar este voto.' });

		return res.status(200).json(vote);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al recuperar el voto.' });
	}
};

module.exports.getVoteConfirmation = async (req, res) => {
	const { voteId } = req.params;
	const { key } = req.query;

	try {
		const vote = await models.Vote.findByPk(voteId, {
			attributes: ['id', 'stars'],
			include: [{
				model: models.Ballot,
				as: 'ballot',
				attributes: ['id',
					[Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('stars')), 2), 'avg'],
					[Sequelize.fn('COUNT', Sequelize.col('stars')), 'count'],
				],
				include: [{
					model: models.Professor,
					as: 'professor',
				},
				{
					model: models.Subject,
					as: 'subject',
				}],
			}],
		});

		if (!vote.id) return res.status(404).json({ message: 'El voto especificado no existe.' });

		if (createHash('sha256').update(vote.stars + req.session.user.id + vote.ballot.id + key).digest('hex') !== vote.id) return res.status(403).json({ message: 'No tienes permiso para visualizar este voto.' });

		const mailContents = await prepareMailTemplate(vote.ballot.professor.name, vote.ballot.subject.name, vote.ballot.subject.id, vote.stars, vote.id, key);
		if (!mailContents) throw new Error('Error al modificar la plantilla del correo de confirmación.');

		if (!await sendVoteMail(req.session.user.email, mailContents)) return res.status(503).json({ message: 'Error al enviar el correo de confirmación.' });

		return res.status(200).json(vote);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al recuperar el voto.' });
	}
};


module.exports.deleteVote = async (req, res) => {
	const { voteId } = req.params;
	const { key } = req.query;

	try {
		const vote = await models.Vote.findByPk(voteId, {
			attributes: ['id', 'stars'],
			include: [{
				model: models.Ballot,
				as: 'ballot',
				attributes: ['id', 'academicYear'],
			}],
		});

		const register = await models.Register.findOne({
			where: {
				ballotId: vote.ballot.id,
				userId: req.session.user.id,
			},
		});

		if (!vote.id) return res.status(404).json({ message: 'El voto especificado no existe.' });

		if (vote.ballot.academicYear !== config.server.academicYear) res.status(409).json({ message: 'La votación seleccionada no pertenece al periodo académico activo.' });

		if (createHash('sha256').update(vote.stars + req.session.user.id + vote.ballot.id + key).digest('hex') !== vote.id) return res.status(403).json({ message: 'No tienes permiso para visualizar este voto.' });

		await vote.destroy();
		await register.destroy();

		return res.status(200).json({ message: 'Voto eliminado.' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al eliminar el voto.' });
	}
};
