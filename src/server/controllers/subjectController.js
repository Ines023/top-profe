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
