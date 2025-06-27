module.exports = (sequelize, Sequelize) => {
  const Annotation = sequelize.define("annotation", {
    projId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "proj_id",
      references: {
        model: 'project',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    docId: {
      type: Sequelize.STRING(255),
      allowNull: false,
      field: "doc_id",
    },
    roomId: {
      type: Sequelize.TEXT,
      allowNull: true,
      field: "room_id",
    },
    data: {
      type: Sequelize.TEXT,
      comment: 'string data'
    },
    createdBy: {
      type: Sequelize.INTEGER,
      field: "created_by",
      references: {
        model: 'user',
        key: 'id'
      }
    },
    updatedBy: {
      type: Sequelize.INTEGER,
      field: "updated_by",
      references: {
        model: 'user',
        key: 'id'
      }
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      field: "is_deleted",
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "created_at"
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      field: "updated_at"
    }
  }, {
    // Additional model options can go here
    tableName: "annotation"
  });

  return Annotation;
};
