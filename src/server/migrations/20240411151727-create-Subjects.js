/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Subjects', {
			id: {
				type: DataTypes.INTEGER,
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
				allowNull: true,
			},
			year: {
				type: DataTypes.INTEGER,
				field: 'year',
				allowNull: false,
			},
			semester: {
				type: DataTypes.ENUM('0', '1', '2'),
				field: 'semester',
				allowNull: false,
			},
			degreeId: {
				type: DataTypes.STRING,
				field: 'degreeId',
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
		await queryInterface.dropTable('Subjects');
	},
};
