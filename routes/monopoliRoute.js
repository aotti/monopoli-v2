const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()
const { validatePlayerJoined, validateUUIDv4 } = require('../middlewares/validator')

router
    .get('/api/mods', validateUUIDv4, Monopoli.getModsData)
    .post('/api/prepare', validateUUIDv4, validatePlayerJoined, Monopoli.playerJoined)
    .post('/api/forcestart', validateUUIDv4, validatePlayerJoined, Monopoli.playerJoined)

module.exports = router