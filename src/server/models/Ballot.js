/* eslint-disable camelcase */


Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-void
exports.Ballot = void 0;
const sequelize_1 = require('sequelize');

class Ballot extends sequelize_1.Model {
	static initModel(sequelize) {
		Ballot.init({
			id: {
				type: sequelize_1.DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			academicYear: {
				type: sequelize_1.DataTypes.INTEGER,
				allowNull: false,
			},
			semester: {
				type: sequelize_1.DataTypes.INTEGER,
				allowNull: false,
			},
		}, {
			sequelize,
		});
		return Ballot;
	}
}
exports.Ballot = Ballot;
