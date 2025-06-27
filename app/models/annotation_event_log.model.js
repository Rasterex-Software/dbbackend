module.exports = (sequelize, Sequelize) => {
  const AnnotationEventLog = sequelize.define("annotation_event_log", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    eventType: {
        type: Sequelize.STRING,
        allowNull: false
    },
    eventData: {
        type: Sequelize.JSON,
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    processedAt: {
        type: Sequelize.DATE,
        allowNull: true
    }
  }, {
    // Additional model options can go here
    tableName: "annotation_event_log",
    timestamps: false,
    underscored: true
  });

  return AnnotationEventLog;
};
