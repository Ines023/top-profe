/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Ballots', {
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
			subjectId: {
				type: DataTypes.INTEGER,
				field: 'subjectId',
			},
			degreeId: {
				type: DataTypes.STRING,
				field: 'degreeId',
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Ballots');
	},
};
