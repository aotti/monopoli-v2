const { newResponse } = require('../helpers/basic')
const monopoliRepo = require('../repository/monopoliRepo')
const MonopoliRepo = new monopoliRepo()
require('dotenv').config()
// pubnub config
const PubNub = require('pubnub')
const pubnub = new PubNub({
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    userId: PubNub.generateUUID()
})

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
            pubnub.publish({
                channel: 'monopoli_v2',
                message: {type: 'gameStatus', data: result}
            }, function (status, response) {
                // send response after realtime data sent
                return newResponse(200, res, result)
            })
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
            if(result != null) {
                // send realtime data
                pubnub.publish({
                    channel: 'monopoli_v2',
                    message: {type: 'playerJoined', data: result}
                }, function (status, response) {
                    // send response after realtime data sent
                    return newResponse(200, res, `${result.player_joined} joining the game`)
                })
            }
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    forceStart(req, res) {
        // get all player data who forced the game 
        MonopoliRepo.forceStartRepo(req, res)
        .then(result => {
            // send realtime data
            pubnub.publish({
                channel: 'monopoli_v2',
                message: {type: 'playerForcing', data: result}
            }, function (status, response) {
                // send response after realtime data sent
                return newResponse(200, res, 'updated')
            })
        })
        .catch(err => {return newResponse(500, res, err)})
    }
    
    ready(req, res) {
        // get all player data who ready to play
        MonopoliRepo.readyRepo(req, res)
        .then(result => {
            // send realtime data
            pubnub.publish({
                channel: 'monopoli_v2',
                message: {type: 'playerReady', data: result}
            }, function (status, response) {
                // send response after realtime data sent
                return newResponse(200, res, 'ready')
            })
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    playerMoving(req, res) {
        const { playerDadu } = req.body
        // send realtime data
        return pubnub.publish({
            channel: 'monopoli_v2',
            message: {type: 'playerMoving', data: playerDadu}
        }, function (status, response) {
            // send response after realtime data sent
            return newResponse(200, res, 'player moving')
        })
    }

    playerTurnEnd(req, res) {
        // get all player data who ready to play
        MonopoliRepo.playerTurnEndRepo(req, res)
        .then(result => {
            // send realtime data
            pubnub.publish({
                channel: 'monopoli_v2',
                message: {type: 'playerTurnEnd', data: result}
            }, function (status, response) {
                // send response after realtime data sent
                return newResponse(200, res, 'turn end')
            })
        })
        .catch(err => {return newResponse(500, res, err)})
    }
}

module.exports = Monopoli