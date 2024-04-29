const config = require('./config.json');

module.exports = {
	host: config.database.host,
	port: config.database.port,
	database: config.database.dbName,
	username: config.database.user,
	password: config.database.password,
	dialect: config.database.dialect,
};
