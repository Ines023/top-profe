

Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-void
exports.Subject = void 0;
// eslint-disable-next-line camelcase
const sequelize_1 = require('sequelize');

class Subject extends sequelize_1.Model {
	static initModel(sequelize) {
		Subject.init({
			id: {
				type: sequelize_1.DataTypes.INTEGER,
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
			year: {
				type: sequelize_1.DataTypes.INTEGER,
				allowNull: false,
			},
			// // DataTypes.ARRAY(DataTypes.INTEGER) not supported for MariaDB
			// semester: {
			//   type: DataTypes.ARRAY(DataTypes.INTEGER),
			//   allowNull: false
			// }
		}, {
			sequelize,
		});
		return Subject;
	}
}
exports.Subject = Subject;
