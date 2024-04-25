/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Registers', {
			id: {
				type: DataTypes.INTEGER,
				field: 'id',
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			valid: {
				type: DataTypes.BOOLEAN,
				field: 'valid',
				allowNull: false,
				defaultValue: true,
			},
			userId: {
				type: DataTypes.STRING,
				field: 'userId',
			},
			ballotId: {
				type: DataTypes.INTEGER,
				field: 'ballotId',
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Registers');
	},
};
