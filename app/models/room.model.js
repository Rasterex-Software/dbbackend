module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define("room", {
      name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
      },
      desc: {
          type: Sequelize.TEXT,
          allowNull: true
      },
      owner: {
          type: Sequelize.INTEGER,
          references: {
              model: "user",
              key: "id"
          },
          allowNull: false
      },
      projId: {
          type: Sequelize.INTEGER,
          field: "proj_id",
          references: {
              model: "project",
              key: "id"
          },
          allowNull: true
      },
      isClosed: {
          type: Sequelize.BOOLEAN,
          field: "is_closed",
          allowNull: false,
          defaultValue: false
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
      tableName: "room"
  });

  return Room;
};
