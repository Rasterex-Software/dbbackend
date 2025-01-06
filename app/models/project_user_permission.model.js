module.exports = (sequelize, Sequelize) => {
  const ProjectUserPermission = sequelize.define("project_user_permission", {
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
    userId: {
      type: Sequelize.INTEGER,
      field: "user_id",
      references: {
        model: 'user',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    permId: {
      type: Sequelize.INTEGER,
      field: "perm_id",
      references: {
        model: 'permission',
        key: 'id'
      },
      onDelete: 'CASCADE'
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
    tableName: "project_user_permission"
  });

  return ProjectUserPermission;
};
