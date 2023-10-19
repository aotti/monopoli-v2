const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()
const { validateUUIDv4, 
        validatePlayerJoined, 
        validatePlayerForcing,
        validatePlayerData,
        validateCityChanges,
        validateSurrender } = require('../middlewares/validator')
// get
router
    .get('/gamestatus', Monopoli.getGameStatus)
    .get('/mods', Monopoli.getModsData)
    .get('/gameresume', validateUUIDv4, Monopoli.gameResume)
    .get('/waiting', validateUUIDv4, Monopoli.getWaitingPlayers)
    .get('/citiesandcards', validateUUIDv4, Monopoli.getCitiesAndCards)
// post
router
    .post('/prepare', validateUUIDv4, validatePlayerJoined, Monopoli.playerJoined)
    .post('/ready', validateUUIDv4, validatePlayerData, Monopoli.playerReady)
    .post('/moveplayer', validateUUIDv4, Monopoli.playerMoving)
// patch
router
    .patch('/mods', validateUUIDv4, Monopoli.changeModsData)
    .patch('/gamestatus', validateUUIDv4, Monopoli.updateGameStatus)
    .patch('/forcestart', validateUUIDv4, validatePlayerForcing, Monopoli.playerForceStart)
    .patch('/turnend', validateUUIDv4, validatePlayerData, Monopoli.playerTurnEnd)
    .patch('/sellcity', validateUUIDv4, validateCityChanges, Monopoli.playerSellCity)
    .patch('/upgradecity', validateUUIDv4, validateCityChanges, Monopoli.playerUpgradeCity)
    .patch('/surrender', validateUUIDv4, validateSurrender, Monopoli.playerSurrender)
// delete
router
    .delete('/deleteplayers', validateUUIDv4, Monopoli.deletePlayerRows)

module.exports = router