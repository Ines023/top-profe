

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert('Degrees', [{
			id: '09TT',
			name: 'Grado en Ingeniería de Tecnologías y Servicios de Telecomunicación',
			acronym: 'GITST',
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: '09ID',
			name: 'Grado en Ingeniería y Sistemas de Datos',
			acronym: 'GISD',
			createdAt: new Date(),
			updatedAt: new Date(),
		}], {});
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete('Degrees', null, {});
	},
};
