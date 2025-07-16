module.exports = {
  any: {
    username: process.env.POSTGRESQL_USERNAME,
    password: process.env.POSTGRESQL_PASSWORD,
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    database: process.env.POSTGRESQL_DATABASE,
    dialect: 'postgres',
  },
};
