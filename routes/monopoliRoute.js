const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()
const { validateUUIDv4, 
        validatePlayerJoined, 
        validatePlayerForcing,
        validatePlayerData } = require('../middlewares/validator')
// get
router
    .get('/gamestatus', Monopoli.getGameStatus)
    .get('/mods', Monopoli.getModsData)
    .get('/gameresume', validateUUIDv4, Monopoli.gameResume)
// post
router
    .post('/prepare', validateUUIDv4, validatePlayerJoined, Monopoli.playerJoined)
    .post('/ready', validateUUIDv4, validatePlayerData, Monopoli.ready)
    .post('/moveplayer', validateUUIDv4, Monopoli.playerMoving)
// patch
router
    .patch('/mods', validateUUIDv4, Monopoli.changeModsData)
    .patch('/gamestatus', validateUUIDv4, Monopoli.updateGameStatus)
    .patch('/forcestart', validateUUIDv4, validatePlayerForcing, Monopoli.forceStart)
    .patch('/turnend', validateUUIDv4, validatePlayerData, Monopoli.playerTurnEnd)
// delete
router
    .delete('/deleteplayers', validateUUIDv4, Monopoli.deletePlayerRows)

module.exports = router