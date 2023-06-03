const router = require('express').Router()
const userController = require('../controllers/userController')
const User = new userController()

router
    .post('/register', User.register)
    .post('/login', User.login)
    .get('/autologin', (req, res) => {})
    .post('/logout', (req, res) => {})
    .patch('/changename', (req, res) => {})

module.exports = router