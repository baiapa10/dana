const Controller = require('../controllers/controller');
const { authorizeRoles } = require('../middlewares/auth');
const router = require('express').Router();

router.get('/', Controller.merchantList);
router.post('/:id/transactions', authorizeRoles('user'), Controller.createTransactionForMerchant);
router.get('/add', authorizeRoles('merchant'), Controller.getMerchant);
router.post('/add', authorizeRoles('merchant'), Controller.addMerchant);
router.get('/:id/edit', authorizeRoles('merchant'), Controller.editMerchantForm);
router.post('/:id/edit', authorizeRoles('merchant'), Controller.updateMerchant);
router.get('/:id', Controller.merchantDetail);
router.get('/:id/delete', authorizeRoles('merchant'), Controller.deleteMerchant);

module.exports = router;
