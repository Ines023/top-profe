const express = require('express');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Sentry = require('@sentry/node');
const loginView = require('./loginView');
const router = require('./router');
const config = require('./config.json');
const pool = require('./db.js');
const { globalErrorHandler } = require('./errors');

if (config.sentry.enabled) Sentry.init({ dsn: config.sentry.dsn });

const app = express();

// Sentry's main middleware.
if (config.sentry.enabled) app.use(Sentry.Handlers.requestHandler());
// Produce logs via morgan's middleware.
app.use(morgan('common'));
// Middleware for reading form-encoded POST payloads.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Serve the frontend files.
app.use(express.static('dist'));
// Let Express know if we are using a reverse proxy.
if (config.server.usingProxy) app.set('trust proxy', 1);
// Persistent session storage.
app.use(session({
	secret: config.server.sessionSecret,
	resave: false,
	proxy: config.server.usingProxy,
	saveUninitialized: true,
	store: new MySQLStore({}, pool),
	cookie: {
		// Make the cookies HTTPS-only if this is a production deployment.
		secure: app.get('env') === 'production',
		// The cookie shouldn't be valid after 20 minutes of inactivity.
		maxAge: 20 * 60 * 1000, // milliseconds
	},
}));
// Main API router.
app.use('/login', loginView.requestHandler);
app.use('/api', router);
// Any other route.
app.use('*', (req, res) => res.sendFile(path.join(__dirname, '../../dist/index.html')));
// The error handler that produces 404/500 HTTP responses.
app.use(globalErrorHandler);
// Sentry's error handler.
if (config.sentry.enabled) app.use(Sentry.Handlers.errorHandler());

app.listen(config.server.port, function () { // eslint-disable-line func-names
	console.log('TOP PROFE - Running on', this.address().address,
		'port', this.address().port);
});
