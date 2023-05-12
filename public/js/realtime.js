const pubnub = new PubNub({
    subscribeKey: 'sub-c-8d86234e-6606-4b80-a3df-96ccbe749a01',
    userId: PubNub.generateUUID()
})
pubnub.subscribe({
    channels: ['monopoli_v2']
})
pubnub.addListener({
    message: function(m) {
        const getMessage = m.message
        switch(getMessage.type) {
            case 'playerJoined':
                waitingOtherPlayers(getMessage.data)
                break
        }
    }
})