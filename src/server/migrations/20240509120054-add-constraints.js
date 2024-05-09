/* eslint-disable no-unused-vars */

const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Añadir constraint UNIQUE para el conjunto (academicYear, professorId y subjectId)
		await queryInterface.addConstraint('Ballots', {
			fields: ['academicYear', 'professorId', 'subjectId'],
			type: 'unique',
			name: 'unique_academicYear_professorId_subjectId_constraint',
		});
	},
	down: async (queryInterface, Sequelize) => {
		// Eliminar la constraint UNIQUE antes de borrar la tabla
		await queryInterface.removeConstraint('Ballots', 'unique_academicYear_professorId_subjectId_constraint');
	},
};
