'use strict';
const {
  Model,
  Op
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Merchant extends Model {
    static associate(models) {
      Merchant.belongsToMany(models.Transaction, {
        through: models.TransactionMerchant,
        foreignKey: 'merchantId'
      });

      Merchant.hasMany(models.TransactionMerchant, {
        foreignKey: 'merchantId'
      });
    }

    static searchAndSort({ search, sortBy, order }) {
      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { category: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const allowedSorts = ['name', 'category', 'createdAt', 'price'];
      const selectedSort = allowedSorts.includes(sortBy) ? sortBy : 'createdAt';
      const selectedOrder = order === 'ASC' ? 'ASC' : 'DESC';

      return Merchant.findAll({
        where,
        order: [[selectedSort, selectedOrder]]
      });
    }
  }

  Merchant.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nama merchant wajib diisi'
        },
        notEmpty: {
          msg: 'Nama merchant tidak boleh kosong'
        }
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Kategori wajib diisi'
        },
        notEmpty: {
          msg: 'Kategori tidak boleh kosong'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Harga merchant wajib diisi'
        },
        isInt: {
          msg: 'Harga merchant harus bilangan bulat'
        },
        min: {
          args: [1],
          msg: 'Harga merchant minimal 1'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Merchant',
    paranoid: true,
  });

  return Merchant;
};

