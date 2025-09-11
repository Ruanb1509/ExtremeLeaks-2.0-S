module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
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
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    timestamps: true,
  });

  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    Comment.belongsTo(models.Content, {
      foreignKey: 'contentId',
      as: 'content'
    });
    Comment.belongsTo(models.Model, {
      foreignKey: 'modelId',
      as: 'model'
    });
    Comment.hasMany(models.CommentLike, {
      foreignKey: 'commentId',
      as: 'commentLikes'
    });
  };

  return Comment;
};