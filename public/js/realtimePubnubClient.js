function startPubNub() {
    if(getLocStorage('uuid')) {
        const pubnub = new PubNub({
            subscribeKey: 'sub-c-174b00df-14de-4efa-9214-cd97594b07e6',
            userId: getLocStorage('uuid')
        })
        pubnub.subscribe({
            channels: ['monopoli_v2']
        })
        pubnub.addListener({
            message: function(m) {
                const getMessage = m.message
                realtimeListener(getMessage)
            }
        })
    }
}

function realtimeListener(getMessage) {
    switch(getMessage.type) {
        case 'gameStatus': 
            const gameStatus = getMessage.payload[0].status
            getGameStatus(false, gameStatus)
            break
        case 'waitingPlayers':
            console.log('waitingPlayers');
            waitingPlayersHandler(getMessage.payload)
            break
        case 'playerJoined':
            console.log('playerJoined');
            playerJoinedHandler(getMessage.payload)
            break
        case 'playerForcing':
            console.log('playerForcing');
            playerForcingHandler(getMessage.payload)
            break
        case 'playerReady':
            console.log('playerReady');
            playerReadyHandler(getMessage.payload)
            break
        case 'playerMoving':
            console.log('playerMoving');
            playerMovingHandler(getMessage.payload)
            break
        case 'playerTurnEnd':
            // this will only run 1x per turn
            playerTurnEndHandler(getMessage.payload)
            break
    }
}