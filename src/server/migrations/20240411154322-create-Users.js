/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Users', {
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
			degreeId: {
				type: DataTypes.STRING,
				field: 'degreeId',
			},
			type: {
				type: DataTypes.ENUM('student', 'professor', 'other'),
				field: 'type',
				allowNull: false,
			},
			admin: {
				type: DataTypes.BOOLEAN,
				field: 'admin',
				allowNull: false,
				defaultValue: false,
			},
			active: {
				type: DataTypes.BOOLEAN,
				field: 'active',
				allowNull: false,
				defaultValue: false,
			},
			excluded: {
				type: DataTypes.BOOLEAN,
				field: 'excluded',
				allowNull: false,
				defaultValue: false,
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
		await queryInterface.dropTable('Users');
	},
};
