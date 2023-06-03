const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()
const { 
    validateUUIDv4, 
    validatePlayerJoined, 
    validatePlayerForcing,
    validatePlayerData } = require('../middlewares/validator')

router
    .get('/gamestatus', validateUUIDv4, Monopoli.getGameStatus)
    .patch('/gamestatus', validateUUIDv4, Monopoli.updateGameStatus)
    .get('/deleteplayers', validateUUIDv4, Monopoli.deletePlayerRows)
    .get('/mods', validateUUIDv4, Monopoli.getModsData)
    .post('/prepare', validateUUIDv4, validatePlayerJoined, Monopoli.playerJoined)
    .patch('/forcestart', validateUUIDv4, validatePlayerForcing, Monopoli.forceStart)
    .post('/ready', validateUUIDv4, validatePlayerData, Monopoli.ready)
    .post('/moveplayer', validateUUIDv4, Monopoli.playerMoving)
    .patch('/turnend', validateUUIDv4, validatePlayerData, Monopoli.playerTurnEnd)

module.exports = router