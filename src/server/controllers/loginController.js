const { models, sequelize } = require('../models');

const config = require('../config.json');

module.exports.handleLogin = (req, res, next) => {
	req.session.user = {
		id: req.session.passport.user.preferred_username,
		email: req.session.passport.user.email,
		name: req.session.passport.user.name,
	};
	res.redirect('/api/admin');
	// next();
};
