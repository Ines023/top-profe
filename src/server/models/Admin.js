const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Admin extends Model {
	}
	Admin.init({
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
	}, {
		sequelize,
	});
	return Admin;
};
