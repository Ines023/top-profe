const Keycloak = require('keycloak-connect');
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./models');
const config = require('./config.json');

const sessionStore = new SequelizeStore({
	db: sequelize,
	table: 'Session',
	checkExpirationInterval: 15 * 60 * 1000,
	expiration: 4 * 60 * 60 * 1000,
});

const keycloak = new Keycloak({ store: sessionStore }, config.sso);

module.exports = { sessionStore, keycloak };
