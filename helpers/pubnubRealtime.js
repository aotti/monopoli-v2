require('dotenv').config()
// pubnub config
const PubNub = require('pubnub')
const pubnub = new PubNub({
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    userId: PubNub.generateUUID()
})

function pubnubPublish(messageType, result, apiResponse) {
    // send realtime data
    pubnub.publish({
        channel: 'monopoli_v2',
        message: {type: messageType, data: result}
    }, function (status, response) {
        // send response after realtime data sent
        return apiResponse
    })
}

module.exports = { pubnubPublish }