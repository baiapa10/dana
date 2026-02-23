'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionMerchant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TransactionMerchant.belongsTo(models.Transaction, {
        foreignKey: 'transactionId'
      });

      TransactionMerchant.belongsTo(models.Merchant, {
        foreignKey: 'merchantId'
      });
    }
  }
  TransactionMerchant.init({
    transactionId: DataTypes.INTEGER,
    merchantId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TransactionMerchant',
  });
  return TransactionMerchant;
};