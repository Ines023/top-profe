const { models, Sequelize } = require('../models');

const config = require('../config.json');

//TODO: Implement two different types of Ranking
module.exports.getProvisionalRanking = async (req, res) => {
	// Returns a list with the 10 most voted professors registered in the application,
	// along with their average scoring.

	try {
		const mostVotedProfessors = await models.Professor.findAll({
			attributes: [
				'id',
				'hash',
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
				status: 'active',
			},
			group: ['Professor.id', 'Professor.name'],
			order: [['count', 'DESC']],
		});


		return res.status(200).json({ mostVotedProfessors: mostVotedProfessors.slice(0, 10) });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al obtener el ranking.' });
	}
};

module.exports.getFinalRanking = async (req, res) => {

	try {
		const academicYear = req.query.academicYear || config.server.currentAcademicYear;
		
		// Returns a list with the 10 most voted professors registered in the application,
		// along with their average scoring.
		const mostVotedProfessors = await models.Professor.findAll({
			attributes: [
				'id',
				'hash',
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
					academicYear: academicYear,
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
				status: 'active',
			},
			group: ['Professor.id', 'Professor.name'],
			order: [['count', 'DESC']],
		});


		return res.status(200).json({ mostVotedProfessors: mostVotedProfessors.slice(0, 10) });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al obtener el ranking.' });
	}
};