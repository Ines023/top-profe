const { models } = require('../models');

const registerUser = async (passportUser) => {
	try {
		const user = {
			id: passportUser.preferred_username,
			email: passportUser.email,
			type: passportUser.upmClassifCode.filter(code => code),
		};

		await models.User.create(user);
	} catch (error) {
		console.log(error);
	}
};

const updateUser = async (registeredUser, passportUser) => {
	try {
		const user = {
			id: passportUser.preferred_username,
			email: passportUser.email,
			type: passportUser.upmClassifCode.filter(code => code),
		};

		await registerUser.save(user);
	} catch (error) {
		console.log(error);
	}
};

module.exports.handleLogin = async (req, res, next) => {
	try {
		const registeredUser = await models.User.findByPk(req.session.passport.user.preferred_username);

		let savedUser;
		if (registeredUser) {
			if (registeredUser.active) req.session.user = registeredUser;
			else savedUser = updateUser(registeredUser, req.session.passport.user);
		} else savedUser = registerUser(req.session.passport.user);

		if (!savedUser) res.status(500).json({ message: 'Error al actualizar los datos del usuario.' });

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al recuperar el usuario.' });
	}
};
