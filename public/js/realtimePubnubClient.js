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
            // reset unused local storages
            localStorage.removeItem('fineAmount')
            localStorage.removeItem('removeNerfParkir')
            break
        case 'waitingPlayers':
            console.log(getMessage.type);
            waitingPlayersHandler(getMessage.payload)
            break
        case 'playerJoined':
            console.log(getMessage.type);
            playerJoinedHandler(getMessage.payload)
            break
        case 'playerForcing':
            console.log(getMessage.type);
            playerForcingHandler(getMessage.payload)
            break
        case 'playerReady':
            console.log(getMessage.type);
            playerReadyHandler(getMessage.payload)
            break
        case 'playerMoving':
            console.log(getMessage.type);
            playerMovingHandler(getMessage.payload)
            break
        case 'playerTurnEnd':
            // this will only run 1x per turn
            playerTurnEndHandler(getMessage.payload)
            break
        case 'playerSellCity':
        case 'playerUpgradeCity':
            console.log(getMessage.type);
            playerCityChangesHandler(getMessage.type, getMessage.payload)
            break
        case 'playerSurrender':
            console.log(getMessage.type);
            playerSurrenderHandler(getMessage.payload)
            break
    }
}