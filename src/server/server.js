/* eslint-disable max-len */
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const { Issuer, Strategy } = require('openid-client');

const sequelize = require('./models');
const router = require('./router');
const config = require('./config.json');
const loginController = require('./controllers/loginController');
const { globalErrorHandler } = require('./errors');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({
	extended: true,
}));

app.use(express.json({ limit: '15mb' }));
// Produce logs via morgan's middleware.
app.use(morgan('common'));
// Middleware for reading form-encoded POST payloads.
app.use(express.json());
// Serve the frontend files.
app.use(express.static('dist'));
// Let Express know if we are using a reverse proxy.
if (config.server.usingProxy) app.set('trust proxy', 1);

// Persistent session storage.
const sessionStore = new SequelizeStore({
	db: sequelize,
	table: 'Session',
	checkExpirationInterval: 15 * 60 * 1000,
	expiration: 4 * 60 * 60 * 1000,
});

app.use(session({
	secret: config.server.sessionSecret,
	resave: false,
	proxy: config.server.usingProxy,
	saveUninitialized: true,
	store: sessionStore,
	cookie: {
		// Make the cookies HTTPS-only if this is a production deployment.
		secure: process.env.NODE_ENV === 'production',
		// The cookie shouldn't be valid after 20 minutes of inactivity.
		maxAge: 20 * 60 * 1000, // milliseconds
	},
}));

// Use helmet headers to secure our application.
app.use(helmet());
// Use passport middlewares for authentication.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	console.log('-----------------------------');
	console.log('Serialize user');
	console.log(user);
	console.log('-----------------------------');
	done(null, user);
});
passport.deserializeUser((user, done) => {
	console.log('-----------------------------');
	console.log('Deserialize user');
	console.log(user);
	console.log('-----------------------------');
	done(null, user);
});

Issuer.discover(config.sso.wellKnownEndpoint)
	.then((keycloakIssuer) => {
		const keycloak = new keycloakIssuer.Client({
			client_id: config.sso.client,
			client_secret: config.sso.secret,
			redirect_uris: config.sso.redirectUris,
			response_types: ['code'],
		});

		passport.use(
			'oidc',
			new Strategy({ client: keycloak, passReqToCallback: true }, (req, tokenSet, userinfo, done) => {
				console.log('tokenSet', tokenSet);
				console.log('userinfo', userinfo);
				req.session.tokenSet = tokenSet;
				req.session.userinfo = userinfo;
				return done(null, tokenSet.claims());
			}),
		);
	});

// Login routes.
app.get(path.join(config.server.path, '/login'), (req, res, next) => { next(); }, passport.authenticate('oidc', { scope: config.sso.scope }));

app.get(path.join(config.server.path, '/login/callback'), passport.authenticate('oidc'), loginController.handleLogin);

// Main API router.
app.use(path.join(config.server.path, '/api'), router);
// Any other route.
app.use('*', (req, res) => res.sendFile(path.join(__dirname, '../../dist/index.html')));
// The error handler that produces 404/500 HTTP responses.
app.use(globalErrorHandler);

app.listen(config.server.port, function () { // eslint-disable-line func-names
	console.log('TOP PROFE - Running on', this.address().address,
		'port', this.address().port);
});
