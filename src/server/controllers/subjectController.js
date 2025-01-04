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

	const adminAvgQuery = req.session.user.admin ? Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('vote.stars')), 2) : 99;
	const adminCountQuery = req.session.user.admin ? Sequelize.fn('COUNT', Sequelize.col('vote.stars')) : 0;

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
				[
					Sequelize.fn('IF',
						Sequelize.where(Sequelize.col('professor.status'), '=', 'excluded'),
						adminAvgQuery,
						Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('vote.stars')), 2)),
					'avg',
				],
				[
					Sequelize.fn('IF',
						Sequelize.where(Sequelize.col('professor.status'), '=', 'excluded'),
						adminCountQuery,
						Sequelize.fn('COUNT', Sequelize.col('vote.stars'))),
					'count',
				],
			],
			include: [{
				model: models.Professor,
				as: 'professor',
				attributes: ['id', 'hash', 'name', 'status'],
				required: true,
				where: {
					[Sequelize.Op.not]: { status: 'retired' },
				},
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
				academicYear: config.server.currentAcademicYear,
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
