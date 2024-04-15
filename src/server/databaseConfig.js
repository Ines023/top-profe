const config = require('./config.json');

module.exports = {
	database: config.database.dbName,
	username: config.database.user,
	password: config.database.password,
	dialect: 'mariadb',
	host: config.database.host,
	port: config.database.port,
};
