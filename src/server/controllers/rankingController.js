const { models, Sequelize } = require('../models');

const config = require('../config.json');


const validateAcademicYear = async (academicYear) => {
	//Validates the format of the query parameter academicYear

    const academicYearRegex = /^\d{4}-\d{2}$/;
    if (!academicYearRegex.test(academicYear)) {
        return { valid: false, message: 'El formato del año académico es incorrecto. Debe ser YYYY-YY.' };
    }

    const [startYear, endYear] = academicYear.split('-').map(Number);

    if ((startYear + 1) % 100 !== endYear) {
        return { valid: false, message: 'El año académico no es consecutivo. Debe ser YYYY-YY con años consecutivos.' };
    }

    const minAcademicYear = await models.Ballot.min('academicYear');
    const minStartYear = parseInt(minAcademicYear.split('-')[0], 10);

    if (startYear < minStartYear) {
        return { valid: false, message: 'El año académico no puede ser inferior al mínimo registrado.' };
    }

    if (academicYear > config.server.currentAcademicYear) {
        return { valid: false, message: 'El año académico no puede ser superior al actual.' };
    }

    return { valid: true };
};

module.exports.getRanking = async (req, res) => {
	// IF YOU CONSULT THE CURRENT ACADEMIC YEAR: 
	// Returns a list with the 10 most voted professors registered in the application,
	// along with their average scoring.

	// IF YOU CONSULT A PREVIOUS ACADEMIC YEAR:
	// Returns a list with the 10 best scored professors, the 10 worst scored professors 
	// and the 10 most voted professors registered in the application,
	// along with their average scoring.

	try {

		const academicYear = req.query.academicYear || config.server.currentAcademicYear;

		const validation = await validateAcademicYear(academicYear);
		if (!validation.valid) {
			return res.status(400).json({ message: validation.message });
		}

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



		if (academicYear == config.server.currentAcademicYear) {
			return res.status(200).json({ mostVotedProfessors: mostVotedProfessors.slice(0, 10) });
		} else {

			//TODO: Implement calculations of best and worst professors
			//const topProfessors =  

			// return res.status(200).json({ topProfessors: topProfessors.slice(0,10), worstProfessors: topProfessors.slice(-10).reverse(), mostVotedProfessors: mostVotedProfessors.slice(0, 10) });
		}

		return res.status(200).json({ mostVotedProfessors: mostVotedProfessors.slice(0, 10) });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al obtener el ranking.' });
	}
};
