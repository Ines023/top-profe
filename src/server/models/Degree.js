const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Degree extends Model {
	}

	Degree.init({
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		acronym: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		sequelize,
	});
	return Degree;
};
