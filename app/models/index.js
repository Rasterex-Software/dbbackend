const dbCfg = require("../config/db.config.js");
const Sequelize = require("sequelize");

const db = {};
function initDB(type) {
  const dbType = type || 'postgres';
  console.log(`Database type: ${dbType}`);
  // If the database type is not specified, default to postgres
  const dbConfig = dbCfg[dbType] || dbCfg.postgres;

  const sequelizeOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: {
      max: dbCfg.pool.max,
      min: dbCfg.pool.min,
      acquire: dbCfg.pool.acquire,
      idle: dbCfg.pool.idle
    },
    logging: false,
  };
  const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, sequelizeOptions);



  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.user = require("./user.model.js")(sequelize, Sequelize);
  db.project = require("./project.model.js")(sequelize, Sequelize);
  db.permission = require("./permission.model.js")(sequelize, Sequelize);
  db.annotation = require("./annotation.model.js")(sequelize, Sequelize);
  db.annotation_event_log = require("./annotation_event_log.model.js")(sequelize, Sequelize);
  db.project_user_permission = require("./project_user_permission.model.js")(sequelize, Sequelize);
  db.room = require("./room.model.js")(sequelize, Sequelize);
  db.stamp_template = require("./stamp_template.model.js")(sequelize, Sequelize);
  db.symbol_folder = require("./symbol_folder.model.js")(sequelize, Sequelize);
  db.symbol = require("./symbol.model.js")(sequelize, Sequelize);


  console.log("DB initialized");
}




module.exports = {
  initDB,
  db
};
