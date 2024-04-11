

Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-void
exports.Admin = void 0;
// eslint-disable-next-line camelcase
const sequelize_1 = require('sequelize');

class Admin extends sequelize_1.Model {
	static initModel(sequelize) {
		Admin.init({
			id: {
				type: sequelize_1.DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			email: {
				type: sequelize_1.DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		}, {
			sequelize,
		});
		return Admin;
	}
}
exports.Admin = Admin;
