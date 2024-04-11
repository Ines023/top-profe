

Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-void
exports.Vote = void 0;
// eslint-disable-next-line camelcase
const sequelize_1 = require('sequelize');

class Vote extends sequelize_1.Model {
	static initModel(sequelize) {
		Vote.init({
			id: {
				type: sequelize_1.DataTypes.STRING,
				primaryKey: true,
				allowNull: false,
			},
			vote: {
				type: sequelize_1.DataTypes.SMALLINT,
				allowNull: false,
			},
		}, {
			sequelize,
		});
		return Vote;
	}
}
exports.Vote = Vote;
