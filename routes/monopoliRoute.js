const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()
const { 
    validateUUIDv4, 
    validatePlayerJoined, 
    validatePlayerForcing,
    validatePlayerReady } = require('../middlewares/validator')

router
    .get('/api/mods', validateUUIDv4, Monopoli.getModsData)
    .post('/api/prepare', validateUUIDv4, validatePlayerJoined, Monopoli.playerJoined)
    .post('/api/forcestart', validateUUIDv4, validatePlayerForcing, Monopoli.forceStart)
    .post('/api/ready', validateUUIDv4, validatePlayerReady, Monopoli.ready)
    .post('/api/endturn', validateUUIDv4, validatePlayerReady, Monopoli.playerTurnEnd)

module.exports = router