
const {
	Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Session extends Model {
	}

	Session.init({
		sid: DataTypes.STRING,
		expires: DataTypes.DATE,
		data: DataTypes.TEXT('medium'),
	}, {
		sequelize,
		modelName: 'Session',
	});
	return Session;
};
