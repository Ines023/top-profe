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
		await queryInterface.bulkInsert('Professors', [
			{
				id: 'professor1', name: faker.person.fullName(), email: faker.internet.email(), status: 'active', createdAt: new Date(), updatedAt: new Date(),
			},
			{
				id: 'professor2', name: faker.person.fullName(), email: faker.internet.email(), status: 'active', createdAt: new Date(), updatedAt: new Date(),
			},
			// Add more professors if needed
		]);

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
		await queryInterface.bulkInsert('Users', [
			{
				id: 'user1', email: faker.internet.email(), degreeId: 'degree1', type: 'student', isAdmin: 0, active: 1, createdAt: new Date(), updatedAt: new Date(),
			},
			{
				id: 'user2', email: faker.internet.email(), degreeId: 'degree2', type: 'student', isAdmin: 0, active: 1, createdAt: new Date(), updatedAt: new Date(),
			},
			// Add more users if needed
		]);

		// Seed Ballots
		const academicYear = '2022-23';
		const ballots = [];
		for (let i = 0; i < 10; i++) {
			const ballot = {
				academicYear,
				professorId: `professor${i % 2 + 1}`, // Alternate between two professors
				subjectId: i % 2 + 1, // Alternate between two subjects
				degreeId: `degree${i % 2 + 1}`, // Alternate between two degrees
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
				studentId: `user${i % 2 + 1}`, // Alternate between two students
				ballotId: i + 1,
			};
			registers.push(register);
		}
		await queryInterface.bulkInsert('Registers', registers);

		// Seed Votes
		const votes = [];
		for (let i = 0; i < 10; i++) {
			const vote = {
				id: `vote${i + 1}`,
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
