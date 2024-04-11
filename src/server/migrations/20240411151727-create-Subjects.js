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
				allowNull: false,
			},
			year: {
				type: DataTypes.INTEGER,
				field: 'year',
				allowNull: false,
			},
			// // DataTypes.ARRAY(DataTypes.INTEGER) not supported for MariaDB
			// semester: {
			//   type: DataTypes.ARRAY(DataTypes.INTEGER),
			//   field: 'semester',
			//   allowNull: false
			// },
			degreeId: {
				type: DataTypes.STRING,
				field: 'degreeId',
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Subjects');
	},
};
