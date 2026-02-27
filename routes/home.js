const Controller = require('../controllers/controller');
const { authorizeRoles } = require('../middlewares/auth');
const router = require('express').Router();

router.get('/', Controller.dashboard);
router.get('/export/pdf', authorizeRoles('user'), Controller.exportUserPdf);
router.post('/topup', authorizeRoles('user'), Controller.topUpWallet);

module.exports = router;

