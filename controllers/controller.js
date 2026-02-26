const PDFDocument = require('pdfkit');
const { User, Merchant, Profile, Wallet, Transaction, TransactionMerchant, sequelize } = require('../models');

class Controller {
  static parseSequelizeError(error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return error.errors.map((e) => e.message);
    }

    return [error.message];
  }

  static async landing(req, res) {
    res.render('landing');
  }

  static registerForm(req, res) {
    res.render('register', { errors: [], oldInput: {} });
  }

  static async register(req, res) {
    const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
    const { name, password, phone, monthlyBudget, currency } = req.body;
    const selectedRole = String(req.body.role || '').trim().toLowerCase();
    const errors = [];

    try {
      if (!['user', 'merchant'].includes(selectedRole)) {
        errors.push('Role wajib dipilih: user atau merchant');
      }

      const userDraft = User.build({
        name,
        email: normalizedEmail,
        password,
        phone,
        role: selectedRole || undefined
      });
      const profileDraft = Profile.build({ monthlyBudget, currency });

      const validationResults = await Promise.allSettled([
        userDraft.validate(),
        profileDraft.validate()
      ]);

      validationResults.forEach((result) => {
        if (result.status === 'rejected') {
          errors.push(...Controller.parseSequelizeError(result.reason));
        }
      });

      if (normalizedEmail) {
        const existingUser = await User.findByEmail(normalizedEmail);
        if (existingUser) {
          errors.push('Email sudah terdaftar');
        }
      }

      if (errors.length > 0) {
        return res.status(400).render('register', {
          errors: [...new Set(errors)],
          oldInput: req.body
        });
      }

      const trx = await sequelize.transaction();

      try {
      const user = await User.create(
        { name, email: normalizedEmail, password, phone, role: selectedRole },
        { transaction: trx }
      );

      await Profile.create(
        {
          monthlyBudget,
          currency,
          userId: user.id
        },
        { transaction: trx }
      );

      await Wallet.create(
        {
          balance: monthlyBudget || 0,
          status: 'active',
          userId: user.id
        },
        { transaction: trx }
      );

      await trx.commit();
      res.redirect('/login?success=Registrasi berhasil, silakan login');
      } catch (error) {
        await trx.rollback();
        res.status(400).render('register', {
          errors: Controller.parseSequelizeError(error),
          oldInput: req.body
        });
      }
    } catch (error) {
      res.status(400).render('register', {
        errors: Controller.parseSequelizeError(error),
        oldInput: req.body
      });
    }
  }

  static loginForm(req, res) {
    res.render('login', {
      error: req.query.error || null,
      success: req.query.success || null
    });
  }

  static async login(req, res) {
    const normalizedEmail = String(req.body.email || '').trim().toLowerCase();
    const { password } = req.body;

    try {
      const user = await User.findByEmail(normalizedEmail);

      if (!user || !user.checkPassword(password)) {
        return res.redirect('/login?error=Email atau password salah');
      }

      req.session.currentUser = { id: user.id };

      res.redirect('/homes');
    } catch (error) {
      res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/login?success=Logout berhasil');
    });
  }

  static async dashboard(req, res) {
    try {
      const currentRole = (req.currentUser?.role || '').toLowerCase();

      if (currentRole === 'user') {
        const userData = await User.findByPk(req.currentUser.id, {
          include: [Profile, Wallet]
        });

        if (!userData || !userData.Wallet) {
          return res.render('dashboardUser', {
            userData,
            transactions: [],
            totalSpent: 0,
            remainingBudget: 0,
            success: req.query.success || null,
            error: req.query.error || null
          });
        }

        const transactions = await Transaction.findAll({
          where: { walletId: userData.Wallet.id },
          include: [{ model: Merchant }],
          order: [['createdAt', 'DESC']]
        });

        const totalSpent = transactions.reduce((sum, trx) => sum + trx.amount, 0);
        const monthlyBudget = userData.Profile ? userData.Profile.monthlyBudget : 0;
        const remainingBudget = monthlyBudget - totalSpent;

        return res.render('dashboardUser', {
          userData,
          transactions,
          totalSpent,
          remainingBudget,
          success: req.query.success || null,
          error: req.query.error || null
        });
      }

      const users = await User.findAll({
        include: [
          { model: Profile },
          {
            model: Wallet,
            include: [
              {
                model: Transaction,
                include: [{ model: Merchant }]
              }
            ]
          }
        ],
        order: [['id', 'ASC']]
      });

      res.render('dashboard', {
        users,
        success: req.query.success || null,
        error: req.query.error || null
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async exportUserPdf(req, res) {
    try {
      const userData = await User.findByPk(req.currentUser.id, {
        include: [Profile, Wallet]
      });

      if (!userData || !userData.Wallet) {
        return res.redirect('/homes?error=Data user atau wallet tidak ditemukan');
      }

      const transactions = await Transaction.findAll({
        where: { walletId: userData.Wallet.id },
        include: [{ model: Merchant }],
        order: [['createdAt', 'DESC']]
      });

      const totalSpent = transactions.reduce((sum, trx) => sum + trx.amount, 0);
      const monthlyBudget = userData.Profile ? userData.Profile.monthlyBudget : 0;
      const remainingBudget = monthlyBudget - totalSpent;
      const currency = userData.Profile ? userData.Profile.currency : 'IDR';

      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const fileName = `budget-report-${userData.name}-${Date.now()}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      doc.pipe(res);

      doc.fontSize(18).text('Budget Report', { align: 'left' });
      doc.moveDown(0.5);
      doc.fontSize(11).text(`User: ${userData.name} (${userData.email})`);
      doc.text(`Tanggal Export: ${new Date().toLocaleString('id-ID')}`);
      doc.moveDown();

      doc.fontSize(12).text(`Total Budget Bulanan: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(monthlyBudget)}`);
      doc.text(`Total Terpakai: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(totalSpent)}`);
      doc.text(`Sisa Budget: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(remainingBudget)}`);
      doc.moveDown();

      doc.fontSize(14).text('Riwayat Transaksi');
      doc.moveDown(0.5);
      doc.fontSize(10);

      if (!transactions.length) {
        doc.text('Belum ada transaksi.');
      } else {
        transactions.forEach((trx, index) => {
          const merchantName = trx.Merchants && trx.Merchants.length
            ? trx.Merchants.map((m) => m.name).join(', ')
            : '-';
          const amount = new Intl.NumberFormat('id-ID', { style: 'currency', currency }).format(trx.amount || 0);
          doc.text(`${index + 1}. ${new Date(trx.createdAt).toLocaleString('id-ID')} | ${merchantName} | Qty: ${trx.quantity || 1} | ${amount}`);
        });
      }

      doc.end();
    } catch (error) {
      res.redirect(`/homes?error=${encodeURIComponent(error.message)}`);
    }
  }

  static async merchantList(req, res) {
    const { search = '', sortBy = 'createdAt', order = 'DESC' } = req.query;

    try {
      const merchants = await Merchant.searchAndSort({ search, sortBy, order });
      const currentRole = (req.currentUser?.role || '').toLowerCase();
      const currentUserDetail = await User.findByPk(req.currentUser.id, {
        include: [Profile, Wallet]
      });

      res.render('home', {
        data: merchants,
        query: { search, sortBy, order },
        success: req.query.success || null,
        error: req.query.error || null,
        currentRole,
        isMerchant: currentRole === 'merchant',
        currentUserDetail
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  static async createTransactionForMerchant(req, res) {
    const { id } = req.params;
    const parsedQuantity = Number(req.body.quantity);
    const trx = await sequelize.transaction();

    try {
      if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        throw new Error('Quantity harus berupa angka bulat dan minimal 1');
      }

      const merchant = await Merchant.findByPk(id);
      if (!merchant) {
        throw new Error('Merchant tidak ditemukan');
      }

      const totalAmount = merchant.price * parsedQuantity;

      const wallet = await Wallet.findOne({
        where: { userId: req.currentUser.id },
        transaction: trx,
        lock: trx.LOCK.UPDATE
      });

      if (!wallet) {
        throw new Error('Wallet user tidak ditemukan');
      }

      if (wallet.balance < totalAmount) {
        throw new Error('Saldo wallet tidak mencukupi');
      }

      const newTransaction = await Transaction.create(
        {
          amount: totalAmount,
          quantity: parsedQuantity,
          walletId: wallet.id
        },
        { transaction: trx }
      );

      await TransactionMerchant.create(
        {
          transactionId: newTransaction.id,
          merchantId: merchant.id
        },
        { transaction: trx }
      );

      await wallet.update(
        { balance: wallet.balance - totalAmount },
        { transaction: trx }
      );

      await trx.commit();
      res.redirect('/homes?success=Transaksi berhasil ditambahkan');
    } catch (error) {
      await trx.rollback();
      res.redirect(`/merchants?error=${encodeURIComponent(error.message)}`);
    }
  }

  static getMerchant(req, res) {
    res.render('addMerchant', { errors: [], oldInput: {} });
  }

  static async addMerchant(req, res) {
    try {
      const { name, category, price } = req.body;
      await Merchant.create({ name, category, price });
      res.redirect('/merchants?success=Merchant berhasil ditambahkan');
    } catch (error) {
      res.status(400).render('addMerchant', {
        errors: Controller.parseSequelizeError(error),
        oldInput: req.body
      });
    }
  }

  static async editMerchantForm(req, res) {
    const { id } = req.params;

    try {
      const merchant = await Merchant.findByPk(id);
      if (!merchant) {
        return res.redirect('/merchants?error=Merchant tidak ditemukan');
      }

      res.render('editMerchant', { merchant, errors: [] });
    } catch (error) {
      res.redirect(`/merchants?error=${encodeURIComponent(error.message)}`);
    }
  }

  static async updateMerchant(req, res) {
    const { id } = req.params;

    try {
      const merchant = await Merchant.findByPk(id);
      if (!merchant) {
        return res.redirect('/merchants?error=Merchant tidak ditemukan');
      }

      await merchant.update({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price
      });

      res.redirect('/merchants?success=Merchant berhasil diupdate');
    } catch (error) {
      const merchant = await Merchant.findByPk(id);
      res.status(400).render('editMerchant', {
        merchant,
        errors: Controller.parseSequelizeError(error)
      });
    }
  }

  static async merchantDetail(req, res) {
    const { id } = req.params;

    try {
      const merchant = await Merchant.findByPk(id, {
        include: [
          {
            model: Transaction,
            include: [
              {
                model: Wallet,
                include: [{ model: User, include: [Profile] }]
              }
            ]
          }
        ]
      });

      if (!merchant) {
        return res.redirect('/merchants?error=Merchant tidak ditemukan');
      }

      res.render('merchantDetail', { merchant });
    } catch (error) {
      res.redirect(`/merchants?error=${encodeURIComponent(error.message)}`);
    }
  }

  static deleteMerchant(req, res) {
    const { id } = req.params;

    Merchant.findByPk(id)
      .then((merchant) => {
        if (!merchant) {
          throw new Error('Merchant tidak ditemukan');
        }
        return merchant.destroy();
      })
      .then(() => {
        res.redirect('/merchants?success=Merchant berhasil dihapus');
      })
      .catch((error) => {
        res.redirect(`/merchants?error=${encodeURIComponent(error.message)}`);
      });
  }

  static async userList(req, res) {
    try {
      const users = await User.findAll({ include: [Profile, Wallet], order: [['id', 'ASC']] });
      res.render('users', { users });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = Controller;
