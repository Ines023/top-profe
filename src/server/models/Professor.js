const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Professor extends Model {
	}

	Professor.init({
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		hash: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM('active', 'excluded', 'retired'),
			allowNull: false,
			defaultValue: 'active',
		},
	}, {
		sequelize,
	});
	return Professor;
};
