const pubnub = new PubNub({
    subscribeKey: 'sub-c-174b00df-14de-4efa-9214-cd97594b07e6',
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
                gameStatus = getMessage.payload[0].status
                getGameStatus(false)
                break
            case 'playerJoined':
                console.log('playerJoined');
                myGameData.username = qS('.userName').value
                // save username in localStorage, so the system can recognize
                // the player when trying to resume the game after reload page
                setLocStorage('uuid', myGameData.username)
                getMessage.payload.forEach(v => {
                    // if the player username is in database, then run the function
                    if(v.player_joined == myGameData.username)
                        waitingOtherPlayers(getMessage.payload)
                })
                break
            case 'playerForcing':
                console.log('playerForcing');
                getMessage.payload.forEach(v => {
                    // if the player username is in database, then run the function
                    if(v.player_joined == myGameData.username)
                        waitingOtherPlayers(getMessage.payload)
                })
                break
            case 'playerReady':
                console.log('playerReady');
                getMessage.payload.forEach((v, i) => {
                    // save all player data
                    playersTurnObj[i] = {
                        username: v.username,
                        jalan: v.jalan
                    }
                    // if the player username is in database, then run the function
                    if(v.username == myGameData.username) {
                        // myGameData
                        myGameData.pos = 0
                        myGameData.harta_uang = v.harta_uang
                        myGameData.harta_kota = v.harta_kota
                        myGameData.kartu = v.kartu
                        myGameData.giliran = v.giliran
                        myGameData.jalan = v.jalan
                        myGameData.penjara = v.penjara
                        // branch data
                        myBranchChance.username = v.username
                        myBranchChance.chance = 100
                        gettingReady(getMessage.payload)
                    }
                })
                break
            case 'playerMoving':
                console.log('playerMoving');
                // player moving
                const { playerDadu, username, branch } = getMessage.payload
                // get shape element for each player
                const playersTurnShape = thisShapeIsMe(username)
                // change firstTime to false after the first dice roll
                if(username == myBranchChance.username)
                    myBranchChance.status = false
                // set global branch value, so other player can see where other player gonna move
                branchChance = branch
                console.log(`${playersTurn[giliranCounter]}: ${branchChance}`);
                // getMessage.payload is playerDadu
                playerMoves(playerDadu, playersTurnShape, branchChance)
                break
            case 'playerTurnEnd':
                // this will only run 1x per turn
                if(realtimeStatus.turnEnd === false) {
                    realtimeStatus.turnEnd = true
                    console.log('playerTurnEnd');
                    getMessage.payload.forEach((v, i) => {
                        // update myGameData 
                        if(v.username == myGameData.username) {
                            myGameData.pos = v.pos
                            myGameData.jalan = v.jalan
                        }
                    })
                    // change the value for next player
                    giliranCounter = getMessage.payload[0].giliran
                    setTimeout(() => {
                        // set back to false for next turn
                        realtimeStatus.turnEnd = false
                        // enable kocok dadu button for next player
                        kocokDaduToggle()
                    }, 3000);
                }
                break
        }
    }
})