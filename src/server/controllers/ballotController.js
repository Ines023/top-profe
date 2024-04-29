const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const { models } = require('../models');
const { sendVoteMail } = require('../mail');

const config = require('../config.json');

function prepareMailTemplate(professorName, subjectName, subjectId, stars, voteId, voteKey) {
	const data = fs.readFileSync(path.resolve(__dirname, '../mailTemplate.html'), 'utf8');
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

		if (ballot.academicYear !== config.server.academicYear) return res.status(409).json({ message: 'La votación seleccionada no pertenece al periodo académico activo.' });
		if (ballot.degreeId !== req.session.user.degreeId) return res.status(403).json({ message: 'El usuario no pertenece a la titulación de la votación.' });

		const existingRegister = await models.Register.findOne({
			where: {
				userId: req.session.user.id,
				ballotId: ballot.id,
			},
		});

		if (existingRegister) return res.status(409).json({ message: 'El usuario ya ha emitido un voto para esta votación.' });

		const vote = await models.Vote.create({
			id: createHash('sha256').update(stars + req.session.user.id + ballotId).digest('hex'),
			ballotId,
			stars,
		});

		const register = await models.Register.create({
			ballotId,
			userId: req.session.user.id,
		});

		const mailContents = await prepareMailTemplate(ballot.professor.name, ballot.subject.name, ballot.subject.id, stars, vote.id, 'asdfasdf');
		if (!mailContents) throw new Error('Error al modificar la plantilla del correo de confirmación.');

		if (!await sendVoteMail(req.session.user.email, mailContents)) {
			vote.destroy();
			register.destroy();
			throw new Error('Error al enviar el correo de confirmación.');
		}

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
