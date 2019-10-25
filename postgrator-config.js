require('dotenv').config();

console.log(process.env.DATABASE_URL, 'process.env.DATABASE_URL');

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  connectionString:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.DATABASE_URL,
  SSL: !!process.env.SSL
};
console.log(process.env.DATABASE_URL, 'second process.env.DATABASE_URL');

// heroku config:set NODE_ENV=production &&
//@bishwas gautam

//DATABASE_URL = 'postgresql://dunder_mifflin:password@localhost/noteful';
