

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert('Degrees', [{
			id: '09TT',
			name: 'Grado en Ingeniería de Tecnologías y Servicios de Telecomunicación',
			acronym: 'GITST',
		},
		{
			id: '09ID',
			name: 'Grado en Ingeniería y Sistemas de Datos',
			acronym: 'GISD',
		}], {});
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete('Degrees', null, {});
	},
};
