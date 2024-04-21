/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Degrees', {
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
			acronym: {
				type: DataTypes.STRING,
				field: 'acronym',
				allowNull: false,
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
		await queryInterface.dropTable('Degrees');
	},
};
