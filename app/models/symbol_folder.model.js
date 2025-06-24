module.exports = (sequelize, Sequelize) => {
  const SymbolFolder = sequelize.define("symbol_folder", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    },
    createdBy: {
      type: Sequelize.INTEGER,
      field: "created_by",
      references: {
        model: "user",
        key: "id"
      }
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      field: "updated_by",
      references: {
        model: "user",
        key: "id"
      }
    },
    createdAt: {
      type: Sequelize.DATE,
      field: "created_at",
      defaultValue: Sequelize.NOW,
      onCreate: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: "updated_at",
      defaultValue: Sequelize.NOW,
      onUpdate: Sequelize.NOW
    }
  }, {
    tableName: "symbol_folder"
  });

  return SymbolFolder;
}; 