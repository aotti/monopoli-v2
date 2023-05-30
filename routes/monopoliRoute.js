const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()
const { 
    validateUUIDv4, 
    validatePlayerJoined, 
    validatePlayerForcing,
    validatePlayerData } = require('../middlewares/validator')

router
    .get('/api/gamestatus', validateUUIDv4, Monopoli.getGameStatus)
    .patch('/api/gamestatus', validateUUIDv4, Monopoli.updateGameStatus)
    .get('/api/deleteplayers', validateUUIDv4, Monopoli.deletePlayerRows)
    .get('/api/mods', validateUUIDv4, Monopoli.getModsData)
    .post('/api/prepare', validateUUIDv4, validatePlayerJoined, Monopoli.playerJoined)
    .patch('/api/forcestart', validateUUIDv4, validatePlayerForcing, Monopoli.forceStart)
    .post('/api/ready', validateUUIDv4, validatePlayerData, Monopoli.ready)
    .post('/api/moveplayer', validateUUIDv4, Monopoli.playerMoving)
    .patch('/api/turnend', validateUUIDv4, validatePlayerData, Monopoli.playerTurnEnd)

module.exports = router