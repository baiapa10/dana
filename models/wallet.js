'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, {
        foreignKey: 'userId'
      });

      Wallet.hasMany(models.Transaction, {
        foreignKey: 'walletId'
      });
    }
  }

  Wallet.init({
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Balance wajib diisi'
        },
        min: {
          args: [0],
          msg: 'Balance tidak boleh negatif'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Status wajib diisi'
        },
        isIn: {
          args: [['active', 'inactive']],
          msg: 'Status hanya boleh active atau inactive'
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Wallet',
  });

  return Wallet;
};
