/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Professors', {
			id: {
				type: DataTypes.STRING,
				field: 'id',
				primaryKey: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				field: 'name',
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				field: 'email',
				allowNull: false,
			},
			status: {
				type: DataTypes.ENUM('active', 'excluded', 'retired'),
				field: 'status',
				allowNull: false,
				defaultValue: 'active',
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Professors');
	},
};
