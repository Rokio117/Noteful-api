require('dotenv').config();

const knex = require('knex');
const { DB_URL } = require('../config');
const { PORT } = require('../config');

const app = require('./app');

const db = knex({
  client: 'pg',
  connection: DB_URL
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
