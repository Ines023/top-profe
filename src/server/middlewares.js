/* eslint-disable max-len */
const { UnauthorizedError, LimitedUserError } = require('./errors');

function checkLogin(req, res, next) {
	if (!req.session.user?.id) return next(new UnauthorizedError());
	return next();
}

function checkLoginMock(req, res, next) {
	console.log('[WARNING] Using the mocked login controller!');
	req.session.user = {
		id: 'p.perez',
		email: 'p.perez@alumnos.upm.es',
		degreeId: null,
		type: 'student',
		isAdmin: true,
		active: true,
	};
	return next();
}

// Load the mocked login comprobation iff this is a development instance.
module.exports.checkLogin = (
	(process.env.NODE_ENV === 'development') ? checkLoginMock
		: checkLogin);

// Rejects queries that aren't from ETSIT students.
module.exports.restrictLimitedUsers = (req, res, next) => {
	if (req.session.user.type !== 'student') return next(new LimitedUserError());
	return next();
};

// Rejects queries that aren't from administrators.
module.exports.restrictAdmins = (req, res, next) => {
	if (!req.session.user.isAdmin) return next(new LimitedUserError());
	return next();
};
