module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'budgie',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
};
