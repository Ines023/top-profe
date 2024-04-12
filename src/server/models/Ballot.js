const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Ballot extends Model {
	}

	Ballot.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		academicYear: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		semester: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		sequelize,
	});
	return Ballot;
};
