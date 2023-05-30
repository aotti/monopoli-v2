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
            case 'gameStatus': 
                gameStatus = getMessage.data[0].status
                getGameStatus(false)
                break
            case 'playerJoined':
                console.log('playerJoined');
                myGameData.username = qS('.userName').value
                // save username in localStorage, so the system can recognize
                // the player when trying to resume the game after reload page
                setLocStorage('username', myGameData.username)
                getMessage.data.forEach(v => {
                    // if the player username is in database, then run the function
                    // ### ERROR: realtime data sent faster than fetch result
                    if(v.player_joined == myGameData.username)
                        waitingOtherPlayers(getMessage.data)
                })
                break
            case 'playerForcing':
                console.log('playerForcing');
                getMessage.data.forEach(v => {
                    // if the player username is in database, then run the function
                    if(v.player_joined == myGameData.username)
                        waitingOtherPlayers(getMessage.data)
                })
                break
            case 'playerReady':
                console.log('playerReady');
                getMessage.data.forEach(v => {
                    // if the player username is in database, then run the function
                    if(v.player_joined == myGameData.username)
                        gettingReady(getMessage.data)
                })
                break
            case 'playerMoving':
                console.log('playerMoving');
                // player moving
                // getMessage.data = playerDadu
                playerMoves(getMessage.data)
                break
            case 'playerTurnEnd':
                console.log('playerTurnEnd');
                if(myGameData.username == getMessage.data[0].username) {
                    myGameData.pos = getMessage.data[0].pos
                    console.log(myGameData);
                }
                kocokDaduToggle()
                break
        }
    }
})