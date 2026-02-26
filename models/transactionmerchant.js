'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionMerchant extends Model {
    static associate(models) {
      TransactionMerchant.belongsTo(models.Transaction, {
        foreignKey: 'transactionId'
      });

      TransactionMerchant.belongsTo(models.Merchant, {
        foreignKey: 'merchantId'
      });
    }
  }

  TransactionMerchant.init({
    transactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Transactions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    merchantId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Merchants',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'TransactionMerchant',
  });

  return TransactionMerchant;
};
