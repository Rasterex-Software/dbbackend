module.exports = (sequelize, Sequelize) => {
  const Permission = sequelize.define("permission", {
    key: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    desc: {
      type: Sequelize.TEXT
    }
  }, {
    // Additional model options can go here
    tableName: "permission",
    timestamps: false, // don't add "createdAt", "updatedAt" fields
  });

  return Permission;
};