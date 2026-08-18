module.exports = (sequelize, Sequelize) => {
    const ViewspaceEvaluation = sequelize.define("viewspace_evaluation", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      tokenHash: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
        field: "token_hash"
      },
      activatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        field: "activated_at"
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: "expires_at"
      },
      lastSeenAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        field: "last_seen_at"
      },
      origin: {
        type: Sequelize.TEXT,
        allowNull: true
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
      },
      company: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true
      }      
    }, {
      tableName: "viewspace_evaluation"
    });
  
    return ViewspaceEvaluation;
  };