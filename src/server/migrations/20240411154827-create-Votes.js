/* eslint-disable no-unused-vars */


const { DataTypes } = require('sequelize');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Votes', {
			id: {
				type: DataTypes.STRING,
				field: 'id',
				primaryKey: true,
				allowNull: false,
			},
			stars: {
				type: DataTypes.SMALLINT,
				field: 'stars',
				allowNull: false,
			},
			ballotId: {
				type: DataTypes.INTEGER,
				field: 'ballotId',
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Votes');
	},
};
