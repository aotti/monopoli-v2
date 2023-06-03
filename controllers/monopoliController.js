// response manage
const { newResponse } = require('../helpers/basic')
// database manage
const monopoliRepo = require('../repository/monopoliRepo')
const MonopoliRepo = new monopoliRepo()
// realtime helper
const { pubnubPublish } = require('../helpers/pubnubRealtime')
const { ablyPublish } = require('../helpers/ablyRealtime')

class Monopoli {
    getGameStatus(req, res) {
        // get mods data 
        MonopoliRepo.getGameStatusRepo(req, res)
        .then(result => {
            return newResponse(200, res, result)
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    updateGameStatus(req, res) {
        // get mods data 
        MonopoliRepo.updateGameStatusRepo(req, res)
        .then(result => {
            // send realtime data
            // pubnub 
            pubnubPublish('gameStatus', result, newResponse(200, res, 'game status updated')) 
            // ably
            // ablyPublish('gameStatus', result, newResponse(200, res, 'game status updated'))
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    deletePlayerRows(req, res) {
        MonopoliRepo.deletePlayerRowsRepo(req, res)
        .then(result => {
            return newResponse(200, res, result)
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    getModsData(req, res) {
        // get mods data 
        MonopoliRepo.getModsDataRepo(req, res)
        .then(result => {
            return newResponse(200, res, result)
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    playerJoined(req, res) {
        // get all player data who joined the game 
        MonopoliRepo.playerJoinedRepo(req, res)
        .then(result => {
            // send realtime data
            // pubnub 
            pubnubPublish('playerJoined', result, res, `${result.player_joined} joining the game`)
            // ably
            // ablyPublish('playerJoined', result, newResponse(200, res, `${result.player_joined} joining the game`))
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    forceStart(req, res) {
        // get all player data who forced the game 
        MonopoliRepo.forceStartRepo(req, res)
        .then(result => {
            // send realtime data
            // pubnub 
            pubnubPublish('playerForcing', result, newResponse(200, res, 'updated'))
            // ably
            // ablyPublish('playerForcing', result, newResponse(200, res, `updated`))
        })
        .catch(err => {return newResponse(500, res, err)})
    }
    
    ready(req, res) {
        // get all player data who ready to play
        MonopoliRepo.readyRepo(req, res)
        .then(result => {
            // send realtime data
            // pubnub 
            pubnubPublish('playerReady', result, newResponse(200, res, 'ready'))
            // ably
            // ablyPublish('playerReady', result, newResponse(200, res, `ready`))
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    playerMoving(req, res) {
        const { playerDadu, username, branch } = req.body
        // send realtime data
        // pubnub 
        pubnubPublish('playerMoving', {playerDadu: playerDadu, username: username, branch: branch}, newResponse(200, res, 'player moving'))
        // ably
        // ablyPublish('playerMoving', {playerDadu: playerDadu, username: username, branch: branch}, newResponse(200, res, `player moving`))
    }

    playerTurnEnd(req, res) {
        // get all player data who ready to play
        MonopoliRepo.playerTurnEndRepo(req, res)
        .then(result => {
            // send realtime data
            // // pubnub 
            pubnubPublish('playerTurnEnd', result, newResponse(200, res, 'turn end')) 
            // ably
            // ablyPublish('playerTurnEnd', result, newResponse(200, res, `turn end`))
        })
        .catch(err => {return newResponse(500, res, err)})
    }
    
}

module.exports = Monopoli