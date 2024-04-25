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


	// pool.query('SELECT professor.id, professor.name, '
	// 	+ 'round(avg(review.stars), 2) AS avg, '
	// 	+ 'count(review.stars) AS count '
	// 	+ 'FROM professor '
	// 	+ 'LEFT JOIN review ON review.prof_id = professor.id '
	// 	+ 'GROUP BY professor.id '
	// 	+ 'ORDER BY professor.name ASC')
	// 	.then(professors => res.json({ professors }))
	// 	.catch(e => next(e));
};
