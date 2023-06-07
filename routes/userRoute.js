const router = require('express').Router()
const userController = require('../controllers/userController')
const User = new userController()
const { validateRegisterLogin, validateUUIDv4 } = require('../middlewares/validator')

// get
router
    .get('/autologin', validateUUIDv4, User.autoLogin)
// post
router
    .post('/register', validateRegisterLogin, User.register)
    .post('/login', validateRegisterLogin, User.login)
    .post('/logout', (req, res) => {})
// patch
router
    .patch('/changename', (req, res) => {})

module.exports = router