/* eslint-disable no-mixed-operators */


// eslint-disable-next-line import/no-extraneous-dependencies
const { faker } = require('@faker-js/faker');

module.exports = {
	up: async (queryInterface) => {
		// Seed Degrees
		await queryInterface.bulkInsert('Degrees', [
			{
				id: 'degree1', name: 'Degree 1', acronym: 'D1', createdAt: new Date(), updatedAt: new Date(),
			},
			{
				id: 'degree2', name: 'Degree 2', acronym: 'D2', createdAt: new Date(), updatedAt: new Date(),
			},
			// Add more degrees if needed
		]);

		// Seed Professors
		const professors = [];
		for (let i = 0; i < 5; i++) { // Change 5 to desired number of professors
			const professor = {
				id: `professor${i + 1}`,
				name: faker.person.fullName(),
				email: faker.internet.email(),
				status: 'active',
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			professors.push(professor);
		}
		await queryInterface.bulkInsert('Professors', professors);

		// Seed Subjects
		await queryInterface.bulkInsert('Subjects', [
			{
				id: 1, name: 'Subject 1', acronym: 'S1', year: 2022, semester: '1', degreeId: 'degree1', createdAt: new Date(), updatedAt: new Date(),
			},
			{
				id: 2, name: 'Subject 2', acronym: 'S2', year: 2022, semester: '2', degreeId: 'degree2', createdAt: new Date(), updatedAt: new Date(),
			},
			// Add more subjects if needed
		]);

		// Seed Users
		const users = [];
		for (let i = 0; i < 10; i++) { // Change 10 to desired number of users
			const user = {
				id: `user${i + 1}`,
				email: faker.internet.email(),
				degreeId: `degree${i % 2 + 1}`,
				type: 'student',
				isAdmin: 0,
				active: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			users.push(user);
		}
		await queryInterface.bulkInsert('Users', users);

		// Seed Ballots
		const ballots = [];
		for (let i = 0; i < 10; i++) {
			const ballot = {
				academicYear: '2022-23',
				professorId: `professor${i % professors.length + 1}`, // Ensure professorId stays within the range of added professors
				subjectId: i % 2 + 1,
				degreeId: `degree${i % 2 + 1}`,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			ballots.push(ballot);
		}
		await queryInterface.bulkInsert('Ballots', ballots);

		// Seed Registers
		const registers = [];
		for (let i = 0; i < 10; i++) {
			const register = {
				valid: 1,
				studentId: `user${i % users.length + 1}`, // Ensure studentId stays within the range of added users
				ballotId: i + 1,
			};
			registers.push(register);
		}
		await queryInterface.bulkInsert('Registers', registers);

		// Seed Votes
		const votes = [];
		for (let i = 0; i < 10; i++) {
			const vote = {
				id: i + 1, // Aquí asignamos valores secuenciales para el campo id
				stars: faker.number.int({ min: 1, max: 5 }),
				ballotId: i + 1,
			};
			votes.push(vote);
		}
		await queryInterface.bulkInsert('Votes', votes);
	},

	down: async (queryInterface) => {
		// Remove all seeded data
		await queryInterface.bulkDelete('Votes', null, {});
		await queryInterface.bulkDelete('Registers', null, {});
		await queryInterface.bulkDelete('Ballots', null, {});
		await queryInterface.bulkDelete('Users', null, {});
		await queryInterface.bulkDelete('Subjects', null, {});
		await queryInterface.bulkDelete('Professors', null, {});
		await queryInterface.bulkDelete('Degrees', null, {});
	},
};
