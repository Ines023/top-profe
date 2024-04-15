const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
	}
	Users.init({
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		type: {
			type: DataTypes.ENUM('student', 'professor', 'institutional'),
			allowNull: false,
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			default: false,
		},
	}, {
		sequelize,
	});
	return Users;
};
