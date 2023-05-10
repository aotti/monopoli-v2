const supabase = require('../helpers/database')
const { newPromise } = require('../helpers/promise')
const { newResponse } = require('../helpers/response')
require('dotenv').config()
// pubnub config
const { v4: uuidv4 } = require('uuid')
const PubNub = require('pubnub')
const pubnub = new PubNub({
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    userId: uuidv4()
})

class Monopoli {
    getModsData(req, res) {
        if(supabase == null)
            return res.send('cannot connect to database')
        const table = 'mods'
        const selectAllDataFromDB = async () => {
            // ambil semua data dari supabase
            const selectColumn = 'board_shape, money_start, money_lose, curse_min, curse_max, branch'
            const {data, error} = await supabase.from(table)
                                .select(selectColumn)
                                .eq('id', 1)
            if(error) {
                newResponse(500, res, error)
            }
            return {data: data, error: error}
        }
        newPromise(selectAllDataFromDB)
        .then(data => {
            newResponse(200, res, data)
        }).catch(err => {
            newResponse(500, res, err)
        })
    }

    playerJoined(req, res) {
        if(supabase == null)
            return res.send('cannot connect to database')
        const table = 'prepare'
        const insertPlayerJoined = async () => {
            // insert player yang join ke supabase
            const {randNumber, username} = req.body
            const {data, error} = await supabase.from(table).insert([
                {
                    player_joined: `${randNumber},${username}`,
                    player_forcing: false,
                    player_ready: false
                }
            ])
            if(error) {
                newResponse(500, res, error)
            }
            return {data: data, error: error}
        }
        const getInsertedData = async () => {
            // ambil data yang baru di insert
            const {data, error} = await supabase.from(table).select().order('id', {ascending: false}).limit(1)
            if(error) {
                newResponse(500, res, error)
            }
            return {data: data, error: error}
        }
        insertPlayerJoined()
        .then(() => {
            newPromise(getInsertedData)
            .then(data => {
                newResponse(200, res, data)
            }).catch(err => {
                newResponse(500, res, err)
            })
        })
        .catch(err => {
            newResponse(500, res, err)
        })
    }

    realtimeTrigger(req, res) {
        console.log(req.body.text);
        pubnub.subscribe({
            channels: ['test_channel']
        })
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