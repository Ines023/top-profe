const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Subject extends Model {
	}
	Subject.init({
		id: {
			type: DataTypes.INTEGER,
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
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		sequelize,
	});
	return Subject;
};
