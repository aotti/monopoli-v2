// realtime handler for playerMoving
function playerMovingHandler(payload) {
    // mods need index 0 to use, ex: mods[0].branch / mods[0].board_shape
    const { playerMoving, mods } = payload
    // player moving
    const { username, playerDadu, branch, putaran, giliran } = playerMoving
    // get shape element for each player
    const playersTurnShape = thisShapeIsMe(username)
    // change firstTime to false after the first dice roll
    if(username == myBranchChance.username && myBranchChance.chance >= mods[0].branch)
        myBranchChance.status = false
    // set global branch value, so other player can see where other player gonna move
    branchChance = branch
    // getMessage.payload is playerDadu
    playerMoves(mods, giliran, playerDadu, playersTurnShape, putaran)
}

// realtime handler for playerTurnEnd
function playerTurnEndHandler(payload) {
    if(oneTimeStatus.turnEnd === false) {
        // set to true to prevent this function run twice
        oneTimeStatus.turnEnd = true
        console.log('playerTurnEnd');
        const { playerTurnEnd, mods } = payload
        const { nextPlayerData, otherPlayerData } = playerTurnEnd[0]
        // next player data 
        const { giliran } = nextPlayerData[0]
        // update playersTurnObj 
        // other players data
        for(let i in otherPlayerData) {
            playersTurnObj[i].pos = otherPlayerData[i].pos
            playersTurnObj[i].harta_uang = otherPlayerData[i].harta_uang
            playersTurnObj[i].kartu = otherPlayerData[i].kartu
        }
        // update player list money
        for(let i in qSA('.uangPlayer')) {
            const moneyList = qSA('.uangPlayer')
            if(typeof moneyList[i] === 'object' && typeof playersTurnObj[i].harta_uang === 'number') {
                moneyList[i].innerText = `Rp ${currencyComma(playersTurnObj[i].harta_uang)}`
            }
        }
        setTimeout(() => {
            // set back to false for next turn
            oneTimeStatus.turnEnd = false
            // enable kocok dadu button for next player
            kocokDaduToggle(giliran, mods)
        }, 3000);
    }
}