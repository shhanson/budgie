module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'budgie'
    }
  },
  test: {
    secret: 'budgieIsAwesome',
    client: 'pg',
    connection: 'postgres://localhost/budgie_test'
  },
  production: {
    secret: 'budgieIsAwesome',
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
