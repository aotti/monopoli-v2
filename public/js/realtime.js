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
                console.log('playerJoined');
                // if the player username is in database, then run the function
                getMessage.data.forEach(v => {
                    if(v.player_joined == qS('.userName').value)
                        waitingOtherPlayers(getMessage.data)
                })
                break
            case 'playerForcing':
                console.log('playerForcing');
                // if the player username is in database, then run the function
                getMessage.data.forEach(v => {
                    if(v.player_joined == qS('.userName').value)
                        waitingOtherPlayers(getMessage.data)
                })
                break
        }
    }
})