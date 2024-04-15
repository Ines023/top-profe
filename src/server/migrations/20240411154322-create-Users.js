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
				type: DataTypes.ENUM('student', 'professor', 'institutional'),
				field: 'type',
				allowNull: false,
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				field: 'isAdmin',
				allowNull: false,
				default: false,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Users');
	},
};
