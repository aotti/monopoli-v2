const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()
const { validatePlayerJoined } = require('../middlewares/requestValidator')

router
    .get('/api/mods', Monopoli.getModsData)
    .post('/api/prepare', validatePlayerJoined, Monopoli.playerJoined)

module.exports = router