// realtime handler for playerMoving
function playerMovingHandler(payload) {
    // mods need index 0 to use, ex: mods[0].branch / mods[0].board_shape
    const { playerMoving, mods } = payload
    // player moving
    const { username, playerDadu, branch, prison, harta_uang, harta_kota, putaran, giliran, penjara } = playerMoving
    // get shape element for each player
    const playersTurnShape = thisShapeIsMe(username)
    // change firstTime to false after the first dice roll
    if(username == myBranchChance.username && myBranchChance.chance > mods[0].branch)
        myBranchChance.status = false
    // set global branch value, so other player can see where other player gonna move
    branchChance = branch
    // set global prison counter
    prisonCounter = prison
    // getMessage.payload is playerDadu
    playerMoves(mods, giliran, playerDadu, playersTurnShape, harta_uang, harta_kota, putaran, penjara)
}

// realtime handler for playerTurnEnd
function playerTurnEndHandler(payload) {
    if(oneTimeStatus.turnEnd === false) {
        // set to true to prevent this function run twice
        oneTimeStatus.turnEnd = true
        console.log('playerTurnEnd');
        // for saving player lose
        const playersTurnLose = []
        // payload from server
        const { playerTurnEnd, mods } = payload
        const { nextPlayerData, otherPlayerData } = playerTurnEnd[0]
        // next player data 
        const { giliran } = nextPlayerData[0]
        // update playersTurnObj 
        // other players data
        for(let i in otherPlayerData) {
            playersTurnObj[i].pos = otherPlayerData[i].pos
            playersTurnObj[i].harta_uang = otherPlayerData[i].harta_uang
            playersTurnObj[i].harta_kota = otherPlayerData[i].harta_kota
            playersTurnObj[i].kartu = otherPlayerData[i].kartu
            // check player money
            if(otherPlayerData[i].harta_uang >= -mods[0].money_lose) 
                playersTurnLose.push(otherPlayerData[i].user_id.username)
        }
        // update player list money
        for(let i in qSA('.uangPlayer')) {
            const moneyList = qSA('.uangPlayer')
            if(typeof moneyList[i] === 'object' && typeof playersTurnObj[i].harta_uang === 'number') {
                moneyList[i].innerText = `Rp ${currencyComma(playersTurnObj[i].harta_uang)}`
                // money gain/lose animation
                // if player gain money
                if(playersTurnObj[i].harta_uang > playersPreMoney[i].harta_uang) {
                    moneyList[i].classList.add('plus')
                    setTimeout(() => { moneyList[i].classList.remove('plus') }, 2000);
                }
                // if player loss money
                else if(playersTurnObj[i].harta_uang < playersPreMoney[i].harta_uang) {
                    moneyList[i].classList.add('minus')
                    setTimeout(() => { moneyList[i].classList.remove('minus') }, 2000);
                }
            }
        }
        // if only 1 player left
        if(playersTurnLose.length === 1) {
            return gameOver(playersTurnLose[0])
        }
        // update player cities
        placeHomeAndHotelOnCity(otherPlayerData)
        setTimeout(() => {
            // update player pre money 
            for(let i in otherPlayerData)
                playersPreMoney[i].harta_uang = otherPlayerData[i].harta_uang
            // set back to false for next turn
            oneTimeStatus.turnEnd = false
            // enable kocok dadu button for next player
            kocokDaduToggle(mods, giliran)
        }, 3000);
    }
}