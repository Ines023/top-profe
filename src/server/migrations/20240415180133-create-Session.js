
const { DataTypes } = require('sequelize');

module.exports = {
	async up(queryInterface) {
		await queryInterface.createTable('Sessions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			sid: {
				type: DataTypes.STRING,
			},
			expires: {
				type: DataTypes.DATE,
			},
			data: {
				type: DataTypes.TEXT('medium'),
			},
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('Sessions');
	},
};
