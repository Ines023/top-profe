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
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		state: {
			type: DataTypes.ENUM('active', 'exluded', 'retired'),
			allowNull: false,
			defaultValue: 'active',
		},
	}, {
		sequelize,
	});
	return Professor;
};
