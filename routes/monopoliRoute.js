const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()
const { 
    validateUUIDv4, 
    validatePlayerJoined, 
    validatePlayerForcing,
    validatePlayerReady } = require('../middlewares/validator')

router
    .get('/api/gamestatus', validateUUIDv4, Monopoli.getGameStatus)
    .patch('/api/gamestatus', validateUUIDv4, Monopoli.updateGameStatus)
    .get('/api/mods', validateUUIDv4, Monopoli.getModsData)
    .post('/api/prepare', validateUUIDv4, validatePlayerJoined, Monopoli.playerJoined)
    .patch('/api/forcestart', validateUUIDv4, validatePlayerForcing, Monopoli.forceStart)
    .patch('/api/ready', validateUUIDv4, validatePlayerReady, Monopoli.ready)
    .post('/api/moveplayer', validateUUIDv4, Monopoli.playerMoving)
    .patch('/api/turnend', validateUUIDv4, Monopoli.playerTurnEnd)

module.exports = router