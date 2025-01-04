const { Model } = require('sequelize');

// TODO: Give it a use.
module.exports = (sequelize, DataTypes) => {
	class Note extends Model {
	}

	Note.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		academicYear: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT('long'),
			allowNull: false,
		},
	}, {
		sequelize,
	});
	return Note;
};
