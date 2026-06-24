const dotenv = require('dotenv');
const path = require('path');

// Load env variables from the parent backend folder .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  development: {
    username: process.env.DB_USER || 'sisalmox_user',
    password: process.env.DB_PASS || 'sisalmox_password',
    database: process.env.DB_NAME || 'sisalmox_prod',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: console.log,
  },
  test: {
    username: process.env.DB_USER || 'sisalmox_user',
    password: process.env.DB_PASS || 'sisalmox_password',
    database: process.env.DB_NAME || 'sisalmox_test',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
};
