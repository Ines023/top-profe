/* eslint-disable no-unused-vars */
const Sequelize = require('sequelize');

const config = require('../databaseConfig.js');

const sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: config.dialect,
	define: { timestamps: false },
});

const Ballot = require('./Ballot')(sequelize, Sequelize.DataTypes);
const Degree = require('./Degree')(sequelize, Sequelize.DataTypes);
const Professor = require('./Professor')(sequelize, Sequelize.DataTypes);
const Register = require('./Register')(sequelize, Sequelize.DataTypes);
const Student = require('./Users.js')(sequelize, Sequelize.DataTypes);
const Subject = require('./Subject')(sequelize, Sequelize.DataTypes);
const Vote = require('./Vote')(sequelize, Sequelize.DataTypes);


Subject.belongsTo(Degree, {
	as: 'degree',
	foreignKey: 'degreeId',
});
Ballot.belongsTo(Professor, {
	as: 'professor',
	foreignKey: 'professorId',
});
Ballot.belongsTo(Subject, {
	as: 'subject',
	foreignKey: 'subjectId',
});
Ballot.belongsTo(Subject, {
	as: 'degree',
	foreignKey: 'degreeId',
});
Student.belongsTo(Degree, {
	as: 'degree',
	foreignKey: 'degreeId',
});
Register.belongsTo(Student, {
	as: 'student',
	foreignKey: 'studentId',
});
Register.belongsTo(Ballot, {
	as: 'ballot',
	foreignKey: 'ballotId',
});
Vote.belongsTo(Ballot, {
	as: 'ballot',
	foreignKey: 'ballotId',
});

module.exports = sequelize;
