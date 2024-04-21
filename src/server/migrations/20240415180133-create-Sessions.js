const { DataTypes } = require('sequelize');

module.exports = {
	async up(queryInterface) {
		await queryInterface.createTable('Sessions', {
			sid: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
				unique: true,
			},
			expires: {
				type: DataTypes.DATE,
			},
			data: {
				type: DataTypes.TEXT('medium'),
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

		},
		{
			sync: { force: true },
		});
	},
	async down(queryInterface) {
		await queryInterface.dropTable('Sessions');
	},
};
