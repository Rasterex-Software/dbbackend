module.exports = {
  postgres: {
    host: "localhost",
    port: "5432",
    username: "postgres",
    password: "postgres",
    database: "postgres",
    dialect: "postgres",
  },
  mysql: {
    host: "localhost",
    port: "3306",
    username: "mysql",
    password: "mysql",
    // can't use "mysql" as the database name.
    database: "mysql_db",
    dialect: "mysql",
  },

  dialectOptions: {
    // ssl: true,
    language: "en"
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
