/* eslint-disable max-len */
const { models } = require('../models');

const schoolCode = '09';
const studentCodes = ['A', 'W'];
const professorCodes = ['D', 'J', 'H', 'M', 'Q', 'U', 'P'];

const retrieveUserFromSession = (passportUser) => {
	let userType = 'other';

	if (Array.isArray(passportUser.upmClassifCode)) {
		passportUser.upmClassifCode.forEach((code) => {
			if (code.startsWith(`CentroLectivo:${schoolCode}:`)) {
				if (studentCodes.includes(code.charAt(code.length - 1))) userType = 'student';
				else if (professorCodes.includes(code.charAt(code.length - 1))) userType = 'professor';
			}
		});
	}

	return {
		id: passportUser.preferred_username,
		email: passportUser.email,
		type: userType,
		isAdmin: false,
		active: false,
	};
};

const registerUser = async (passportUser) => {
	try {
		const user = retrieveUserFromSession(passportUser);

		await models.Users.create(user);
	} catch (error) {
		console.log(error);
	}
};

const updateUser = async (registeredUser, passportUser) => {
	try {
		const user = retrieveUserFromSession(passportUser);

		await registeredUser.save(user);
	} catch (error) {
		console.log(error);
	}
};

module.exports.handleLogin = async (req, res, next) => {
	try {
		const registeredUser = await models.Users.findByPk(req.session.passport.user.preferred_username);

		let didSaveUser;
		if (registeredUser) {
			if (registeredUser.active) req.session.user = registeredUser;
			else didSaveUser = updateUser(registeredUser, req.session.passport.user);
		} else didSaveUser = registerUser(req.session.passport.user);

		if (!didSaveUser) res.status(500).json({ message: 'Error al actualizar los datos del usuario.' });

		next();
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al recuperar el usuario.' });
	}
};
