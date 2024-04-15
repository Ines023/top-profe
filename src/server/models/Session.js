
const {
	Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Session extends Model {
	}

	Session.init({
		sid: { type: DataTypes.STRING, primaryKey: true },
		expires: DataTypes.DATE,
		data: DataTypes.TEXT('medium'),
	}, {
		sequelize,
	});
	return Session;
};
