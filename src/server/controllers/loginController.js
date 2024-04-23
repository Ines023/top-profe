/* eslint-disable max-len */
const { models } = require('../models');

const schoolCode = '09';
const studentCodes = ['A', 'W'];
const professorCodes = ['D', 'J', 'H', 'M', 'Q', 'U', 'P'];

const retrieveUserFromSession = (userInfo) => {
	let userType = 'other';

	if (Array.isArray(userInfo.upmClassifCode)) {
		userInfo.upmClassifCode.forEach((code) => {
			if (code.startsWith(`CentroLectivo:${schoolCode}:`)) {
				if (studentCodes.includes(code.charAt(code.length - 1))) userType = 'student';
				else if (professorCodes.includes(code.charAt(code.length - 1))) userType = 'professor';
			}
		});
	}

	return {
		id: userInfo.preferred_username,
		email: userInfo.email,
		type: userType,
		isAdmin: false,
		active: false,
	};
};

const registerUser = async (userInfo) => {
	try {
		const user = retrieveUserFromSession(userInfo);

		await models.Users.create(user);
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const updateUser = async (registeredUser, userInfo) => {
	try {
		const user = retrieveUserFromSession(userInfo);

		await registeredUser.save(user);
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

module.exports.handleLogin = async (req, res, next) => {
	try {
		const registeredUser = await models.Users.findByPk(req.session.userInfo.preferred_username);

		let savedUser;
		if (registeredUser) {
			if (registeredUser.active) savedUser = registeredUser;
			else savedUser = updateUser(registeredUser, req.session.userInfo);
		} else savedUser = registerUser(req.session.userInfo);

		if (!savedUser) res.status(500).json({ message: 'Error al acceder a los datos del usuario.' });

		req.session.user = savedUser;

		return next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al recuperar el usuario.' });
	}
};
