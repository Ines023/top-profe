/* eslint-disable no-unused-vars */
const Sequelize = require('sequelize');

const config = require('../databaseConfig');

const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect,
});

const Ballot = require('./Ballot')(sequelize, Sequelize.DataTypes);
const Degree = require('./Degree')(sequelize, Sequelize.DataTypes);
const Professor = require('./Professor')(sequelize, Sequelize.DataTypes);
const Register = require('./Register')(sequelize, Sequelize.DataTypes);
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Subject = require('./Subject')(sequelize, Sequelize.DataTypes);
const Vote = require('./Vote')(sequelize, Sequelize.DataTypes);
const Session = require('./Session')(sequelize, Sequelize.DataTypes);

Ballot.belongsTo(Professor, {
	as: 'professor',
	sourceKey: 'professorId',
	targetKey: 'id',
	onDelete: 'CASCADE',
});
Ballot.belongsTo(Subject, {
	as: 'subject',
	sourceKey: 'subjectId',
	targetKey: 'id',
	onDelete: 'CASCADE',
});
Ballot.belongsTo(Degree, {
	as: 'degree',
	sourceKey: 'degreeId',
	targetKey: 'id',
	onDelete: 'CASCADE',
});
Ballot.hasMany(Vote, {
	as: 'vote',
	foreignKey: 'ballotId',
	onDelete: 'CASCADE',
});
Ballot.hasMany(Register, {
	as: 'register',
	foreignKey: 'ballotId',
	onDelete: 'CASCADE',
});

Degree.hasMany(Ballot, {
	as: 'ballot',
	foreignKey: 'degreeId',
	onDelete: 'CASCADE',
});

Professor.hasMany(Ballot, {
	as: 'ballot',
	foreignKey: 'professorId',
	onDelete: 'CASCADE',
});
Professor.hasMany(Vote, {
	as: 'vote',
	foreignKey: 'id',
	onDelete: 'CASCADE',
});

User.belongsTo(Degree, {
	as: 'degree',
	foreignKey: 'degreeId',
	onDelete: 'SET NULL',
});

Register.belongsTo(User, {
	as: 'user',
	foreignKey: 'userId',
	onDelete: 'CASCADE',
});
Register.belongsTo(Ballot, {
	as: 'ballot',
	foreignKey: 'ballotId',
	onDelete: 'CASCADE',
});

Subject.belongsTo(Degree, {
	as: 'degree',
	sourceKey: 'degreeId',
	targetKey: 'id',
});

Vote.belongsTo(Ballot, {
	as: 'ballot',
	sourceKey: 'ballotId',
	targetKey: 'id',
	onDelete: 'CASCADE',
});

Vote.belongsTo(Professor, {
	through: Ballot,
	sourceKey: 'voteId',
	targetKey: 'id',
	as: 'vote',
});

module.exports = sequelize;
