module.exports = {
  host: "localhost",
  port: "5432",
  username: "postgres",
  password: "postgres",
  database: "postgres",
  dialect: "postgres",
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
