module.exports = (sequelize, Sequelize) => {
  const Symbol = sequelize.define(
    "symbol",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      type: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      data: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      folderId: {
        type: Sequelize.INTEGER,
        field: "folder_id",
        references: {
          model: "symbol_folder",
          key: "id",
        },
      },
      createdBy: {
        type: Sequelize.INTEGER,
        field: "created_by",
        references: {
          model: "user",
          key: "id",
        },
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        field: "updated_by",
        references: {
          model: "user",
          key: "id",
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.NOW,
        onCreate: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at",
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW,
      },
    },
    {
      tableName: "symbol",
    }
  );

  return Symbol;
};
