/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addConstraint('Subjects', {
			fields: ['degreeId'],
			type: 'foreign key',
			name: 'Subjects_degreeId_fkey',
			references: {
				table: 'Degrees',
				field: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		});
		await queryInterface.addConstraint('Ballots', {
			fields: ['professorId'],
			type: 'foreign key',
			name: 'Ballots_professorId_fkey',
			references: {
				table: 'Professors',
				field: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		});
		await queryInterface.addConstraint('Ballots', {
			fields: ['subjectId'],
			type: 'foreign key',
			name: 'Ballots_subjectId_fkey',
			references: {
				table: 'Subjects',
				field: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		});
		await queryInterface.addConstraint('Users', {
			fields: ['degreeId'],
			type: 'foreign key',
			name: 'Users_degreeId_fkey',
			references: {
				table: 'Degrees',
				field: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		});
		await queryInterface.addConstraint('Registers', {
			fields: ['userId'],
			type: 'foreign key',
			name: 'Registers_userId_fkey',
			references: {
				table: 'Users',
				field: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		});
		await queryInterface.addConstraint('Registers', {
			fields: ['ballotId'],
			type: 'foreign key',
			name: 'Registers_ballotId_fkey',
			references: {
				table: 'Ballots',
				field: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		});
		await queryInterface.addConstraint('Votes', {
			fields: ['ballotId'],
			type: 'foreign key',
			name: 'Votes_ballotId_fkey',
			references: {
				table: 'Ballots',
				field: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeConstraint('Subjects', 'Subjects_degreeId_fkey');
		await queryInterface.removeConstraint('Ballots', 'Ballots_professorId_fkey');
		await queryInterface.removeConstraint('Ballots', 'Ballots_subjectId_fkey');
		await queryInterface.removeConstraint('Users', 'Users_degreeId_fkey');
		await queryInterface.removeConstraint('Registers', 'Registers_userId_fkey');
		await queryInterface.removeConstraint('Registers', 'Registers_ballotId_fkey');
		await queryInterface.removeConstraint('Votes', 'Votes_ballotId_fkey');
	},
};
