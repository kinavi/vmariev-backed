import { Sequelize } from 'sequelize';

require('dotenv').config();

if (!process.env.DB_NAME) {
  throw console.error('not has process.env.DB_NAME');
}
if (!process.env.DB_USER_NAME) {
  throw console.error('not has process.env.DB_USER_NAME');
}
if (!process.env.DB_USER_PASSWORD) {
  throw console.error('not has process.env.DB_USER_PASSWORD');
}
if (!process.env.DB_PORT) {
  throw console.error('not has process.env.DB_USER_PASSWORD');
}

let sequelizeConnection: Sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER_NAME,
  process.env.DB_USER_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: Number(process.env.DB_PORT),
  }
);

export default sequelizeConnection;
