// realtime handler for playerJoined
function playerJoinedHandler(payload) {
    // mods need index 0 to use, ex: mods[0].branch / mods[0].board_shape
    const { playerJoined, mods, gameStatus } = payload
    playerJoined.forEach((v, i) => {
        getPlayerJoined[i] = v.player_joined
        // if the player username is in database, then run the function
        if(v.player_joined == myGameData.username) 
            return waitingOtherPlayers(playerJoined, mods, gameStatus)
    })
}

// realtime handler for playerForcing
function playerForcingHandler(payload) {
    // mods need index 0 to use, ex: mods[0].branch / mods[0].board_shape
    const { playerForcing, mods, gameStatus } = payload
    playerForcing.forEach(v => {
        // if the player username is in database, then run the function
        if(v.player_joined == myGameData.username)
            return waitingOtherPlayers(playerForcing, mods, gameStatus)
    })
}

// realtime handler for playerReady
function playerReadyHandler(payload) {
    const { playerReady, mods } = payload
    playerReady.forEach((v, i) => {
        // save all player data
        playersTurnObj[i] = {
            username: v.user_id.username,
            pos: v.pos,
            harta_uang: v.harta_uang,
            harta_kota: v.harta_kota,
            kartu: v.kartu
        }
        // if the player username is in database, then run the function
        if(v.user_id.username == myGameData.username) {
            // branch data
            myBranchChance.username = v.user_id.username
            myBranchChance.chance = 100
        }
    })
    // check ready players
    gettingReady(playerReady, mods)
}