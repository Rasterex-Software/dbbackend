const dbCfg = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelizeOptions = {
  host: dbCfg.host,
  port: dbCfg.port,
  dialect: dbCfg.dialect,
  pool: {
    max: dbCfg.pool.max,
    min: dbCfg.pool.min,
    acquire: dbCfg.pool.acquire,
    idle: dbCfg.pool.idle
  }
};
const sequelize = new Sequelize(dbCfg.database, dbCfg.username, dbCfg.password, sequelizeOptions);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.project = require("./project.model.js")(sequelize, Sequelize);
db.permission = require("./permission.model.js")(sequelize, Sequelize);
db.annotation = require("./annotation.model.js")(sequelize, Sequelize);
db.project_user_permission = require("./project_user_permission.model.js")(sequelize, Sequelize);

module.exports = db;
