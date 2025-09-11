module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    contentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contents',
        key: 'id'
      }
    },
    modelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'models',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('content', 'model'),
      allowNull: false,
    },
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'contentId', 'modelId', 'type']
      }
    ]
  });

  Like.associate = function(models) {
    Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Like.belongsTo(models.Content, {
      foreignKey: 'contentId',
      as: 'content'
    });
    Like.belongsTo(models.Model, {
      foreignKey: 'modelId',
      as: 'model'
    });
  };

  return Like;
};