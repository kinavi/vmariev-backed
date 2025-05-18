require('ts-node/register');

if (process.env.NODE_ENV === 'test') {
  require('dotenv').config({ path: '.env.test' });
} else {
  require('dotenv').config();
}

module.exports = {
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: Number(process.env.DB_PORT),
  logging: process.env.NODE_ENV !== 'test',
};
