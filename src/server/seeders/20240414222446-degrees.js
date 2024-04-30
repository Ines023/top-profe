

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert('Degrees', [
			{
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
			},
			{
				id: '09BM',
				name: 'Grado en Ingeniería Biomédica',
				acronym: 'GIB',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '09AQ',
				name: 'Máster Universitario en Ingeniería de Telecomunicación',
				acronym: 'MUIT',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '09BA',
				name: 'Máster Universitario en Ingeniería de Redes y Servicios Telemáticos',
				acronym: 'MUIRST',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '09AW',
				name: 'Máster Universitario en Ciberseguridad',
				acronym: 'MUCS',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '09BP',
				name: 'Máster Universitario en Energía Solar Fotovoltaica',
				acronym: 'MUESFV',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '09AU',
				name: 'Máster Universitario en Ingeniería Biomédica',
				acronym: 'MUIB',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '09AZ',
				name: 'Máster Universitario en Ingeniería de Sistemas Electrónicos',
				acronym: 'MUISE',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '09AR',
				name: 'Máster Universitario en Tratamiento Estadístico-Computacional de la Información',
				acronym: 'MUTECI',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: '09AT',
				name: 'Máster Universitario en Teoría de la Señal y Comunicaciones',
				acronym: 'MUTSC',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		], {});
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete('Degrees', null, {});
	},
};
