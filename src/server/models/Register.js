

Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-void
exports.Register = void 0;
// eslint-disable-next-line camelcase
const sequelize_1 = require('sequelize');

class Register extends sequelize_1.Model {
	static initModel(sequelize) {
		Register.init({
			id: {
				type: sequelize_1.DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			valid: {
				type: sequelize_1.DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: true,
			},
		}, {
			sequelize,
		});
		return Register;
	}
}
exports.Register = Register;
