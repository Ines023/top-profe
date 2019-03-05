/**
 * View that handles CAS's response after login.
 *
 * This is NOT an API endpoint, it simply redirects the user depending on
 * whether the authentication was successful or not.
 *
 * If a valid token is provided, the user is redirected to the URL specified in
 * the "redirect" query parameter. In the rare case that the token was invalid,
 * the user is redirected to /failed-login.
 *
 * Keep in mind that CAS is supposed to take the user here iff the
 * authentication was successful, so the user should never get to /failed-login
 * (or at least in theory).
 */
const crypto = require('crypto');
const got = require('got');
const xml2js = require('xml2js');
const xmlProcessors = require('xml2js/lib/processors');
const config = require('./config.json');
const pool = require('./db');

function registerUserLogin(email) {
	const userType = email.endsWith('alumnos.upm.es') ? 'STDNT' : 'OTHER';

	return pool.query(`INSERT INTO login_stats (type) VALUES ("${userType}")`);
}

module.exports.requestHandler = (req, res, next) => {
	// CAS emits each token for a specific service, identified by its strict URL
	// (including path, the querystring, etc.).
	// We are therefore forced to include the same information when validating
	// the token for our service.
	const serviceUrl = new URL(req.originalUrl, config.server.url);
	serviceUrl.searchParams.delete('ticket');

	const validationUrl = `${config.cas.ssoUrl}/p3/serviceValidate?`
		+ `service=${encodeURIComponent(serviceUrl.href)}&`
		+ `ticket=${encodeURIComponent(req.query.ticket)}`;

	return got(validationUrl)
		.then((response) => {
			const parserOptions = {
				// Remove the XML namespace prefixes to access the parsed
				// object more easily.
				tagNameProcessors: [xmlProcessors.stripPrefix],
			};
			xml2js.parseString(response.body, parserOptions, (err, result) => {
				if (err) throw err;

				// Go to /failed-login if the token isn't valid.
				const { serviceResponse } = result;
				if (serviceResponse.authenticationFailure) return res.redirect('/failed-login');

				let sessionResponse = {}

				serviceResponse.authenticationSuccess.forEach((obj) => {
					// Find the user and add it to sessionResponse. Also add the account type to the session.
					if ('user' in obj) {
						[sessionResponse.user] = obj.user;
						req.session.accountType = sessionResponse.user.split('@')[1]
					}


					if ('attributes' in obj) {
						const [attributes] = obj.attributes;

						// Find the common name attribute and add it to sessionResponse.
						if ('cn' in attributes) {
							[sessionResponse.cn] = attributes.cn;
						}

						// Find the surname attribute and add it to sessionResponse.
						if ('sn' in attributes) {
							[sessionResponse.sn] = attributes.sn;
						}

						// Find the organization attribute and store it in req.session.
						[req.session.org] = attributes.o;
					}
				});

				// Store this login in the database for analytics.
				registerUserLogin(req.session.accountType);

				// Generate the reviewerHash here just for convenience.
				hashData = sessionResponse.cn + sessionResponse.sn + sessionResponse.user + req.session.org
				req.session.reviewerHash = crypto.createHash('md5').update(hashData).digest('hex');

				// Take the user back to wherever they were before the login.
				return res.redirect(req.query.redirect);
			});
		})
		.catch(e => next(e));
};
