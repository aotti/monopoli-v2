const { newPromise } = require('../helpers/promise')
const { newResponse } = require('../helpers/response')
const { selectAll, 
        selectOne, 
        selectNewInsertedData, 
        insertDataRow, 
        insertDataCol,
        updateData, 
        deleteAll  } = require('../helpers/databaseQueries')
require('dotenv').config()
// pubnub config
const PubNub = require('pubnub')
const pubnub = new PubNub({
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    userId: PubNub.generateUUID()
})

class Monopoli {
    getModsData(req, res) {
        // TABLE = mods
        // required data for query
        const queryObject = {
            table: 'mods',
            selectColumn: 'board_shape, money_start, money_lose, curse_min, curse_max, branch',
            whereColumn: 'id',
            whereValue: 1
        }
        // get mods data for board 
        newPromise(selectOne(req, res, queryObject))
        .then(result => {
            return newResponse(200, res, result)
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    playerJoined(req, res) {
        // TABLE = prepare
        const {randNumber, username} = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepare'},
            reqRandNumber: {enumerable: true, value: randNumber},
            reqUsername: {enumerable: true, value: username},
            insertColumn: {enumerable: true, get: function() {
                return {
                    player_joined: this.reqUsername,
                    player_forcing: false,
                    player_ready: false,
                    player_rand: this.reqRandNumber
                } 
            }}
        })
        // insert player data who joined the game
        newPromise(insertDataRow(req, res, queryObject))
        .then(() => {
            // get all player data who joined the game
            newPromise(selectAll(req, res, queryObject))
            .then(result => {
                // send realtime data
                pubnub.publish({
                    channel: 'monopoli_v2',
                    message: {type: 'playerJoined', data: result}
                }, function (status, response) {
                    // send response after realtime data sent
                    return newResponse(200, res, `${result.player_joined} joining the game`)
                })
            })
            .catch(err => {return newResponse(500, res, err)})
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    forceStart(req, res) {
        // TABLE = prepare
        const { username } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepare'},
            whereColumn: {enumerable: true, value: 'player_joined'},
            whereValue: {enumerable: true, value: username},
            updateColumn: {enumerable: true, get: function() {
                return {
                    player_forcing: true
                } 
            }}
        })
        // update player_forcing value to true
        newPromise(updateData(req, res, queryObject))
        .then(() => {
            // return all player data, so client-side know who did force start
            newPromise(selectAll(req, res, queryObject))
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
        })
        .catch(err => {return newResponse(500, res, err)})
    }
    
}

module.exports = Monopoli