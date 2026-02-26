const Controller = require('../controllers/controller');
const { redirectIfLoggedIn } = require('../middlewares/auth');
const router = require('express').Router();

router.get('/register', redirectIfLoggedIn, Controller.registerForm);
router.post('/register', redirectIfLoggedIn, Controller.register);

router.get('/login', redirectIfLoggedIn, Controller.loginForm);
router.post('/login', redirectIfLoggedIn, Controller.login);

router.get('/logout', Controller.logout);

module.exports = router;
