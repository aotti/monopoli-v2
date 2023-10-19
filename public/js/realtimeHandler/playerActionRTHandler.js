// realtime handler for playerMoving
function playerMovingHandler(payload) {
    // mods need index 0 to use, ex: mods[0].branch / mods[0].board_shape
    const { playerMoving, mods } = payload
    // player moving
    const { username, playerDadu, branch, prison, harta_uang, harta_kota, kartu, putaran, giliran, penjara } = playerMoving
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
    const moneyCitiesCards = {
        playerMoney: harta_uang,
        playerCities: harta_kota,
        playerCards: kartu
    }
    playerMoves(mods, giliran, playerDadu, playersTurnShape, moneyCitiesCards, putaran, penjara)
}

// realtime handler for playerTurnEnd
function playerTurnEndHandler(payload) {
    // oneTimeStatus prevent this function to run more than 1x
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
        updatePlayerListMoney()
        // update player cards 
        updateCardBox(otherPlayerData)
        // update player cities 
        placeHomeAndHotelOnCity(otherPlayerData)
        // if only 1 player left
        if(playersTurnLose.length === 1) {
            return gameOver(playersTurnLose[0])
        } 
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

function playerCityChangesHandler(type, payload) {
    const changesPayload = payload[0]
    const changesType = type == 'playerSellCity' ? 'menjual' : 'upgrade'
    // data from payload
    const cityForUsername = changesPayload.username
    const cityForChanges = changesPayload.city_for_sale ? changesPayload.city_for_sale : changesPayload.city_for_upgrade
    const cityAfterChanges = changesPayload.playerSellCityAll ? changesPayload.playerSellCityAll : changesPayload.playerUpgradeCityAll
    // find changes player
    const findPlayerChanges = cityAfterChanges.map(v => {return v.user_id.username}).indexOf(cityForUsername)
    if(findPlayerChanges === -1) {
        feedbackTurnOn('player(sell/upgrade) tidak ditemukan')
        return feedbackTurnOff()
    } 
    // update data for player who does a changes
    playersTurnObj[findPlayerChanges].harta_kota = cityAfterChanges[findPlayerChanges].harta_kota
    playersTurnObj[findPlayerChanges].harta_uang = cityAfterChanges[findPlayerChanges].harta_uang
    playersTurnObj[findPlayerChanges].kartu = cityAfterChanges[findPlayerChanges].kartu
    // update player list money
    updatePlayerListMoney()
    // update player cities
    placeHomeAndHotelOnCity(cityAfterChanges)
    // send notif to all players
    feedbackTurnOn(`${cityForUsername} ${changesType} kota ${cityForChanges}`)
    return feedbackTurnOff()
}

function playerSurrenderHandler(payload) {
    // find the surrender
    const findSurrender = payload.map(v => {return v.harta_uang}).indexOf(-999_999)
    if(findSurrender === -1) return
    // check if its not the player's turn
    if(payload[findSurrender].jalan === false) {
        // proceed to surrender
        // update data for player who surrendered
        playersTurnObj[findSurrender].harta_kota = payload[findSurrender].harta_kota
        playersTurnObj[findSurrender].harta_uang = payload[findSurrender].harta_uang
        playersTurnObj[findSurrender].kartu = payload[findSurrender].kartu
        // update player list money
        updatePlayerListMoney()
        // update player cities
        placeHomeAndHotelOnCity(payload)
        // send notif to all players
        qS('#pSurrender').play()
        feedbackTurnOn(`${payload[findSurrender].user_id.username} udah males main ${emoji.catShock}`)
        return feedbackTurnOff()
    }
    else {
        // send notif to all players
        feedbackTurnOn(`${payload[findSurrender].user_id.username} pengen udahan tapi gagal ${emoji.sweatJoy} ${emoji.pray}`)
        return feedbackTurnOff()
    }
}