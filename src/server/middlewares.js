/* eslint-disable max-len */
const { UnauthorizedError, LimitedUserError, ExcludedUserError, NonActiveUserError } = require('./errors');
const { models } = require('./models');

function checkLogin(req, res, next) {
	if (!req.session.user?.id) return next(new UnauthorizedError());
	models.User.findByPk(req.session.user.id, { raw: true })
		.then((user) => {
			if (!user) throw new Error('El objeto usuario está vacío.');
			req.session.user = user;
			return next();
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({ message: 'Ha ocurrido un error recuperando el usuario.' });
		});
	
}

function checkLoginMock(req, res, next) {
	console.log('[WARNING] Using the mocked login controller!');
	req.session.user = {
		id: 'p.perez',
		email: 'p.perez@alumnos.upm.es',
		degreeId: null,
		type: 'student',
		admin: true,
		active: true,
		excluded: false
	};
	return next();
}

// Load the mocked login comprobation iff this is a development instance.
module.exports.checkLogin = (
	(process.env.NODE_ENV === 'development') ? checkLoginMock
		: checkLogin);

// Rejects queries from excluded users.
module.exports.checkActive = (req, res, next) => {
	if (!req.session.user.active) return next(new NonActiveUserError());
	return next();
};

// Rejects queries from excluded users.
module.exports.restrictExcluded = (req, res, next) => {
	if (req.session.user.excluded) return next(new ExcludedUserError());
	return next();
};

// Rejects queries that aren't from ETSIT students.
module.exports.restrictLimitedUsers = (req, res, next) => {
	if (req.session.user.type !== 'student') return next(new LimitedUserError());
	return next();
};

// Rejects queries that aren't from administrators.
module.exports.restrictAdmins = (req, res, next) => {
	if (!req.session.user.admin) return next(new LimitedUserError());
	return next();
};
