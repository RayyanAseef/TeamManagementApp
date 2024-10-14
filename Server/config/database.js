const { Sequelize } = require('sequelize');
const config = require('./config.json');
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Initialize Sequelize with the configuration
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

module.exports = sequelize;