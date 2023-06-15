require('dotenv').config()
// response manage
const { newResponse } = require('../helpers/basic')
// pubnub config
const PubNub = require('pubnub')
const pubnub = new PubNub({
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    userId: process.env.UUID_V4
})

function pubnubPublish(messageType, result, res, resMessage) {
    // send realtime data
    pubnub.publish({
        channel: 'monopoli_v2',
        message: {type: messageType, payload: result}
    }, function (status, response) {
        // send response after realtime data sent
        // return apiResponse
        // ### STATUS, RESPONSE LOG
        console.log(status);
        return newResponse([200, resMessage], res, result)
    })
}

module.exports = { pubnubPublish }