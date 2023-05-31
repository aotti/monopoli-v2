require('dotenv').config()
// ably config
const Ably = require('ably')
const ably = new Ably.Realtime.Promise({
    key: process.env.ABLY_API_KEY
})

function ablyPublish(messageType, result, apiResponse) {
    ably.connection.connect()
    console.log('API: new connection');
    const channel = ably.channels.get('monopoli_v2')
    // publish data to client
    channel.publish('realtime_data', {type: messageType, payload: result})
    .then(result => {
        console.log(messageType);
        // wait till receive all messages and then shut down
        ably.close();
        console.log("API: Closed the connection to Ably.");
    })
    .catch(err => {console.log(err);})
}

module.exports = { ablyPublish }