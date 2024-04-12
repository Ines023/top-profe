const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class Register extends Model {
	}
	Register.init({
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		valid: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
	}, {
		sequelize,
	});
	return Register;
};
