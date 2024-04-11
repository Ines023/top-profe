/* eslint-disable camelcase */


Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-multi-assign, max-len, no-void
exports.initModels = exports.Vote = exports.Register = exports.Student = exports.Ballot = exports.Degree = exports.Subject = exports.Professor = void 0;
const Professor_1 = require('./Professor');

Object.defineProperty(exports, 'Professor', { enumerable: true, get() { return Professor_1.Professor; } });
const Subject_1 = require('./Subject');

Object.defineProperty(exports, 'Subject', { enumerable: true, get() { return Subject_1.Subject; } });
const Degree_1 = require('./Degree');

Object.defineProperty(exports, 'Degree', { enumerable: true, get() { return Degree_1.Degree; } });
const Ballot_1 = require('./Ballot');

Object.defineProperty(exports, 'Ballot', { enumerable: true, get() { return Ballot_1.Ballot; } });
const Student_1 = require('./Student');

Object.defineProperty(exports, 'Student', { enumerable: true, get() { return Student_1.Student; } });
const Register_1 = require('./Register');

Object.defineProperty(exports, 'Register', { enumerable: true, get() { return Register_1.Register; } });
const Vote_1 = require('./Vote');

Object.defineProperty(exports, 'Vote', { enumerable: true, get() { return Vote_1.Vote; } });
function initModels(sequelize) {
	Professor_1.Professor.initModel(sequelize);
	Subject_1.Subject.initModel(sequelize);
	Degree_1.Degree.initModel(sequelize);
	Ballot_1.Ballot.initModel(sequelize);
	Student_1.Student.initModel(sequelize);
	Register_1.Register.initModel(sequelize);
	Vote_1.Vote.initModel(sequelize);
	Subject_1.Subject.belongsTo(Degree_1.Degree, {
		as: 'degree',
		foreignKey: 'degreeId',
	});
	Ballot_1.Ballot.belongsTo(Professor_1.Professor, {
		as: 'professor',
		foreignKey: 'professorId',
	});
	Ballot_1.Ballot.belongsTo(Subject_1.Subject, {
		as: 'subject',
		foreignKey: 'subjectId',
	});
	Student_1.Student.belongsTo(Degree_1.Degree, {
		as: 'degree',
		foreignKey: 'degreeId',
	});
	Register_1.Register.belongsTo(Student_1.Student, {
		as: 'student',
		foreignKey: 'studentId',
	});
	Register_1.Register.belongsTo(Ballot_1.Ballot, {
		as: 'ballot',
		foreignKey: 'ballotId',
	});
	Vote_1.Vote.belongsTo(Ballot_1.Ballot, {
		as: 'ballot',
		foreignKey: 'ballotId',
	});
	return {
		Professor: Professor_1.Professor,
		Subject: Subject_1.Subject,
		Degree: Degree_1.Degree,
		Ballot: Ballot_1.Ballot,
		Student: Student_1.Student,
		Register: Register_1.Register,
		Vote: Vote_1.Vote,
	};
}
exports.initModels = initModels;
