const { models, Sequelize } = require('../models');

const config = require('../config.json');

module.exports.getSubjects = async (req, res) => {
	try {
		const subjects = await models.Subject.findAll({
			include: [{
				model: models.Degree,
				as: 'degree',
				attributes: ['id', 'acronym'],
			}],
		});

		res.status(200).json(subjects);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al obtener los datos de las asignaturas.' });
	}
};

module.exports.getSubjectDetails = async (req, res) => {
	const { subjectId } = req.params;

	try {
		const subject = await models.Subject.findOne({
			where: {
				id: subjectId,
			},
			include: [{
				model: models.Degree,
				as: 'degree',
				attributes: ['id', 'acronym'],
			}],
		});

		const ballots = await models.Ballot.findAll({
			attributes: [
				'id',
				[Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('vote.stars')), 2), 'avg'],
				[Sequelize.fn('COUNT', Sequelize.col('vote.stars')), 'count'],
			],
			include: [{
				model: models.Professor,
				as: 'professor',
				attributes: ['id', 'hash', 'name', 'status'],
				required: true,
			},
			{
				model: models.Vote,
				as: 'vote',
				attributes: [],
				required: false,
			},
			{
				model: models.Register,
				as: 'register',
				required: false,
				where: {
					userId: req.session.user.id,
				},
			},
			],
			where: {
				academicYear: config.server.academicYear,
				subjectId: subject.id,
			},
			group: ['Ballot.professorId', 'Ballot.subjectId'],
		});
		res.status(200).json({ subject, ballots });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al obtener los datos de la asignatura.' });
	}
};
