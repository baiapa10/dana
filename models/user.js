'use strict';
const bcrypt = require('bcryptjs');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: 'userId'
      });

      User.hasOne(models.Wallet, {
        foreignKey: 'userId'
      });
    }

    static findByEmail(email) {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      return User.findOne({ where: { email: normalizedEmail } });
    }

    checkPassword(plainPassword) {
      return bcrypt.compareSync(plainPassword, this.password);
    }

    get maskedPhone() {
      if (!this.phone || this.phone.length < 4) return this.phone;
      return `${this.phone.slice(0, 4)}****${this.phone.slice(-3)}`;
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Nama wajib diisi'
        },
        notEmpty: {
          msg: 'Nama tidak boleh kosong'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email sudah terdaftar'
      },
      set(value) {
        this.setDataValue('email', String(value || '').trim().toLowerCase());
      },
      validate: {
        notNull: {
          msg: 'Email wajib diisi'
        },
        
        notEmpty: {
          msg: 'Email tidak boleh kosong'
        },
        isEmail: {
          msg: 'Format email tidak valid'
        },
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password wajib diisi'
        },
        notEmpty: {
          msg: 'Password tidak boleh kosong'
        },
        len: {
          args: [8, 255],
          msg: 'Password minimal 8 karakter'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Nomor telepon sudah terdaftar'
      },
      validate: {
        notNull: {
          msg: 'Nomor telepon wajib diisi'
        },
        notEmpty: {
          msg: 'Nomor telepon tidak boleh kosong'
        },
        isNumeric: {
          msg: 'Nomor telepon harus angka'
        },
        len: {
          args: [10, 20],
          msg: 'Nomor telepon minimal 10 angka'
        },
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        notNull: {
          msg: 'Role wajib diisi'
        },
        isIn: {
          args: [['user', 'merchant']],
          msg: 'Role hanya boleh user atau merchant'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(user) {
        user.password = bcrypt.hashSync(user.password, 10);
      },
      beforeUpdate(user) {
        if (user.changed('password')) {
          user.password = bcrypt.hashSync(user.password, 10);
        }
      },
      beforeBulkCreate(users) {
        users.forEach((user) => {
          user.password = bcrypt.hashSync(user.password, 10);
        });
      }
    }
  });

  return User;
};
