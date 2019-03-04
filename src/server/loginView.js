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
				if (err) next(err);

				// Go to /failed-login if the token isn't valid.
				const { serviceResponse } = result;
				if (serviceResponse.authenticationFailure) return res.redirect('/failed-login');

				serviceResponse.authenticationSuccess.forEach((obj) => {
					// Find the user attribute and add it to req.session.
					if ('user' in obj) [req.session.user] = obj.user;
				});

				// Generate the reviewerHash here just for convenience.
				req.session.reviewerHash = crypto.createHash('md5').update(req.session.user).digest('hex');

				// Take the user back to wherever they were before the login.
				return res.redirect(req.query.redirect);
			});
		})
		.catch(e => next(e));
};
