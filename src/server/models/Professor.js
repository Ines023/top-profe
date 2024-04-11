

Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-void
exports.Professor = void 0;
// eslint-disable-next-line camelcase
const sequelize_1 = require('sequelize');

class Professor extends sequelize_1.Model {
	static initModel(sequelize) {
		Professor.init({
			id: {
				type: sequelize_1.DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: sequelize_1.DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: sequelize_1.DataTypes.STRING,
				allowNull: false,
			},
			state: {
				type: sequelize_1.DataTypes.ENUM('active', 'exluded', 'retired'),
				allowNull: false,
				defaultValue: 'active',
			},
		}, {
			sequelize,
		});
		return Professor;
	}
}
exports.Professor = Professor;
