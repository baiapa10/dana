'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Wallet, {
        foreignKey: 'walletId'
      });

      Transaction.belongsToMany(models.Merchant, {
        through: models.TransactionMerchant,
        foreignKey: 'transactionId'
      });

      Transaction.hasMany(models.TransactionMerchant, {
        foreignKey: 'transactionId'
      });
    }

    get formattedAmount() {
      const amount = this.amount || 0;
      return `Rp ${amount.toLocaleString('id-ID')}`;
    }
  }

  Transaction.init({
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Amount wajib diisi'
        },
        min: {
          args: [1],
          msg: 'Amount minimal 1'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        notNull: {
          msg: 'Quantity wajib diisi'
        },
        min: {
          args: [1],
          msg: 'Quantity minimal 1'
        }
      }
    },
    walletId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Wallets',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  return Transaction;
};
