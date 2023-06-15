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
// patch
router
    .patch('/login', validateRegisterLogin, User.login)
    .patch('/logout', validateUUIDv4, User.logout)
    .patch('/changename', (req, res) => {})

module.exports = router