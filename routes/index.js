
const router = require('express').Router()
const user = require('./user.js')
const merchant = require('./merchant.js')
const login = require('./login.js')
const Controller = require('../controllers/controller.js')

// router.get('/', Controller.home)
router.use("/homes", login)
router.use("/users", user)
router.use("/merchants", merchant)

module.exports = router