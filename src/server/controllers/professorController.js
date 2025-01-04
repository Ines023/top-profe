const { models, Sequelize } = require('../models');

const config = require('../config.json');

module.exports.getProfessors = async (req, res) => {
	// Returns a list with all the professors registered in the application,
	// along with their average scoring.

	const adminAvgQuery = req.session.user.admin ? Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('ballot->vote.stars')), 2) : 99;
	const adminCountQuery = req.session.user.admin ? Sequelize.fn('COUNT', Sequelize.col('ballot->vote.stars')) : 0;

	try {
		const professors = await models.Professor.findAll({
			attributes: [
				'id',
				'hash',
				'name',
				'status',
				[
					Sequelize.fn('IF',
						Sequelize.where(Sequelize.col('status'), '=', 'excluded'),
						adminAvgQuery,
						Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('ballot->vote.stars')), 2)),
					'avg',
				],
				[
					Sequelize.fn('IF',
						Sequelize.where(Sequelize.col('status'), '=', 'excluded'),
						adminCountQuery,
						Sequelize.fn('COUNT', Sequelize.col('ballot->vote.stars'))),
					'count',
				],
			],
			include: [{
				model: models.Ballot,
				as: 'ballot',
				attributes: [],
				required: true,
				where: {
					academicYear: config.server.currentAcademicYear,
				},
				include: [
					{
						model: models.Vote,
						as: 'vote',
						attributes: [],
						required: false,
					},
				],
			}],
			where: {
				[Sequelize.Op.not]: { status: 'retired' },
			},
			group: ['Professor.id', 'Professor.name'],
			order: [['name', 'ASC']],
		});


		res.status(200).json(professors);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al obtener los datos de los profesores.' });
	}
};

module.exports.getProfessorProfile = async (req, res) => {
	// Returns a list with all the subjects taught by a specific professor, and
	// the corresponding reviews.

	const { professorHash } = req.params;

	try {
		const professor = await models.Professor.findOne({ where: { hash: professorHash } });

		const ballots = await models.Ballot.findAll({
			attributes: [
				'id',
				[
					Sequelize.fn('IF',
						professor.status === 'excluded' && !req.session.user.admin,
						99,
						Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('vote.stars')), 2)),
					'avg',
				],
				[
					Sequelize.fn('IF',
						professor.status === 'excluded' && !req.session.user.admin,
						0,
						Sequelize.fn('COUNT', Sequelize.col('vote.stars'))),
					'count',
				],
			],
			include: [{
				model: models.Subject,
				as: 'subject',
				attributes: ['id', 'acronym', 'name', 'degreeId'],
				required: true,
				include: [{
					model: models.Degree,
					as: 'degree',
					attributes: ['id', 'acronym'],
				}],
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
				professorId: professor.id,
			},
			group: ['Ballot.professorId', 'Ballot.subjectId'],
		});
		res.status(200).json({ professor, ballots });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al obtener los datos del profesor.' });
	}
};
