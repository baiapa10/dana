const Controller = require('../controllers/controller')

const router = require('express').Router()


router.get('/', Controller.home)



module.exports = router