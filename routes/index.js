const router = require('express').Router();
const user = require('./user');
const merchant = require('./merchant');
const login = require('./login');
const home = require('./home');
const Controller = require('../controllers/controller');
const { requireLogin, authorizeRoles } = require('../middlewares/auth');

router.get('/', Controller.landing);
router.use('/', login);
router.use('/homes', requireLogin, home);
router.use('/users', requireLogin, authorizeRoles('merchant'), user);
router.use('/merchants', requireLogin, merchant);

module.exports = router;
