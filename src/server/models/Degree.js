/* eslint-disable camelcase */


Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-void
exports.Degree = void 0;
const sequelize_1 = require('sequelize');

class Degree extends sequelize_1.Model {
	static initModel(sequelize) {
		Degree.init({
			id: {
				type: sequelize_1.DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: sequelize_1.DataTypes.STRING,
				allowNull: false,
			},
			acronym: {
				type: sequelize_1.DataTypes.STRING,
				allowNull: false,
			},
		}, {
			sequelize,
		});
		return Degree;
	}
}
exports.Degree = Degree;
