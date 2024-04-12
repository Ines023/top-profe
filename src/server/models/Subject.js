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
			allowNull: true,
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		semester: {
			type: DataTypes.ENUM('0', '1', '2'),
			allowNull: false,
		},
	}, {
		sequelize,
	});
	return Subject;
};
