module.exports = (sequelize, Sequelize) => {
  const StampTemplate = sequelize.define("stamp_template", {
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
    type: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    desc: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    data: {
      type: Sequelize.TEXT,
      allowNull: false
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
    // Additional model options can go here
    tableName: "stamp_template"
  });

  return StampTemplate;
};