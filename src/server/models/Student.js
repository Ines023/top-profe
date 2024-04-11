

Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-void
exports.Student = void 0;
// eslint-disable-next-line camelcase
const sequelize_1 = require('sequelize');

class Student extends sequelize_1.Model {
	static initModel(sequelize) {
		Student.init({
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
		return Student;
	}
}
exports.Student = Student;
