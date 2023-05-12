const supabase = require('../helpers/database')
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
        const queryObject = {
            table: 'mods',
            selectColumn: 'board_shape, money_start, money_lose, curse_min, curse_max, branch',
            chooseColumn: 'id',
            columnValue: 1
        }
        newPromise(selectOne(req, res, queryObject))
        .then(result => {
            newResponse(200, res, result)
        })
        .catch(err => newResponse(500, res, err))
    }

    playerJoined(req, res) {
        if(supabase == null)
            return res.send('cannot connect to database')
        const {randNumber, username} = req.body
        const queryObject = {}
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
        insertDataRow(req, res, queryObject)
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
                    newResponse(200, res, result)
                })
            })
            .catch(err => newResponse(500, res, err))
        })
        .catch(err => newResponse(500, res, err))
    }

    forceStart(req, res) {
        if(supabase == null)
            return res.send('cannot connect to database')
        const table = 'prepare'
        const playerForcing = async () => {
            const { username } = req.body
            const {data, error} = await supabase.from(table).update({ player_forcing: true }).eq('player_joined', username)
            if(error) {
                newResponse(500, res, error)
            }
            return {data: data, error: error}
        }
        newPromise(playerForcing)
        .then(result => {
            newResponse(200, res, 'updated')
        })
        .catch(err => newResponse(500, res, err))
    }

    realtimeTrigger(req, res) {
        pubnub.publish({
            channel: 'test_channel',
            message: "hello world"
        }, function (status, response) {
            // console.log(status);
            // console.log(response);
            return res.status(200).json({
                status: status.statusCode,
                message: status.error == false ? `success` : `failed`,
                response: response.timetoken
            })
        })
    }
}

module.exports = Monopoli