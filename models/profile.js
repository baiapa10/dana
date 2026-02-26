'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  }

  Profile.init({
    monthlyBudget: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Monthly budget wajib diisi'
        },
        isInt: {
          msg: 'Monthly budget harus berupa angka bulat'
        },
        minimumBudget(value) {
          if (Number(value) < 100000) {
            throw new Error('Monthly budget minimal 100000');
          }
        }
      }
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Currency wajib diisi'
        },
        notEmpty: {
          msg: 'Currency tidak boleh kosong'
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
    modelName: 'Profile',
  });

  return Profile;
};
