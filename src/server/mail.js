const nodemailer = require('nodemailer');

const config = require('./config.json');

const smtpTransport = nodemailer.createTransport({
	host: config.email.host,
	port: config.email.port,
	tls: {
		secure: config.email.ssl, // Use `true` for port 465, `false` for all other ports
		requireTLS: true,
	},
	auth: {
		user: config.email.user,
		pass: config.email.password,
	},
});

module.exports.sendVoteMail = async (to, htmlBody) => {
	try {
		const mailOptions = {
			from: `Top Profe DAT-ETSIT <${config.email.user}>`,
			to,
			subject: 'Tu voto se ha registrado ✔',
			html: htmlBody,
		};
		await smtpTransport.sendMail(mailOptions);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};
