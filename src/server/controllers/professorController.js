const { models, Sequelize } = require('../models');

const config = require('../config.json');

module.exports.getProfessors = async (req, res) => {
	// Returns a list with all the professors registered in the application,
	// along with their average scoring.


	try {
		const professors = await models.Professor.findAll({
			attributes: [
				'id',
				'name',
				'status',
				[Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('ballot->vote.stars')), 2), 'avg'],
				[Sequelize.fn('COUNT', Sequelize.col('ballot->vote.stars')), 'count'],
			],
			include: [{
				model: models.Ballot,
				as: 'ballot',
				attributes: [],
				required: true,
				where: {
					academicYear: config.server.academicYear,
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

	const { profId } = req.params;

	try {
		const professor = await models.Professor.findByPk(profId);

		const ballots = await models.Ballot.findAll({
			attributes: [
				'id',
				[Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('vote.stars')), 2), 'avg'],
				[Sequelize.fn('COUNT', Sequelize.col('vote.stars')), 'count'],
			],
			include: [{
				model: models.Subject,
				as: 'subject',
				attributes: ['id', 'acronym', 'name'],
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
