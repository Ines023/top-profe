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
});
Ballot.belongsTo(Subject, {
	as: 'subject',
	sourceKey: 'subjectId',
	targetKey: 'id',
});
Ballot.belongsTo(Degree, {
	as: 'degree',
	sourceKey: 'degreeId',
	targetKey: 'id',
});
Ballot.hasMany(Vote, {
	as: 'vote',
	foreignKey: 'ballotId',
});
Ballot.hasMany(Register, {
	as: 'register',
	foreignKey: 'ballotId',
});

Degree.hasMany(Ballot, {
	as: 'ballot',
	foreignKey: 'degreeId',
});

Professor.hasMany(Ballot, {
	as: 'ballot',
	foreignKey: 'professorId',
});
Professor.hasMany(Vote, {
	as: 'vote',
	foreignKey: 'id',
});

User.belongsTo(Degree, {
	as: 'degree',
	foreignKey: 'degreeId',
	onDelete: 'SET NULL',
});

Register.belongsTo(User, {
	as: 'user',
	foreignKey: 'userId',
});
Register.belongsTo(Ballot, {
	as: 'ballot',
	foreignKey: 'ballotId',
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
});

Vote.belongsTo(Professor, {
	through: Ballot,
	sourceKey: 'voteId',
	targetKey: 'id',
	as: 'vote',
});

module.exports = sequelize;
