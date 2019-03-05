const { UnauthorizedError, LimitedUserError } = require('./errors');

function checkLogin(req, res, next) {
	if (!req.session.reviewerHash) return next(new UnauthorizedError());
	return next();
}

function checkLoginMock(req, res, next) {
	console.log('[WARNING] Using the mocked login controller!');
	req.session.accountType = 'alumnos.upm.es';
	req.session.reviewerHash = '8275924d5082fc42a64e0d6b529c7224';
	req.session.org = '09';
	return next();
}

// Load the mocked login comprobation iff this is a development instance.
module.exports.checkLogin = (
	(process.env.NODE_ENV === 'development') ? checkLoginMock : 
	checkLogin);

// Rejects queries that aren't from ETSIT students.
module.exports.restrictLimitedUsers = (req, res, next) => {
	if (!req.session.accountType.endsWith('alumnos.upm.es') || req.session.org !== '09') {
		return next(new LimitedUserError());
	}
	return next();
};
