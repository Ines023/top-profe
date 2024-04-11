/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Admins', {
			id: {
				type: DataTypes.STRING,
				field: 'id',
				primaryKey: true,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				field: 'email',
				allowNull: false,
				unique: true,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Admins');
	},
};
