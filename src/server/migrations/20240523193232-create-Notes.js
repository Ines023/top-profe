/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Notes', {
			id: {
				type: DataTypes.INTEGER,
				field: 'id',
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			academicYear: {
				type: DataTypes.STRING,
				field: 'academicYear',
				allowNull: false,
			},
			professorId: {
				type: DataTypes.STRING,
				field: 'professorId',
			},
			content: {
				type: DataTypes.TEXT('long'),
				field: 'content',
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

		await queryInterface.addConstraint('Notes', {
			fields: ['professorId'],
			type: 'foreign key',
			name: 'Notes_professorId_fkey',
			references: {
				table: 'Professors',
				field: 'id',
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeConstraint('Notes', 'Notes_professorId_fkey');
		await queryInterface.dropTable('Notes');
	},
};
