require('dotenv').config({ path: './config.env' });

const MONGO_URL = process.env.DB_URL.replace(
  '<password>',
  process.env.DB_PASSWORD
);
const PORT = process.env.PORT;

module.exports = {
  MONGO_URL,
  PORT,
};
