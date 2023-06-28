// get all player last position
function allPlayersLastPos() {
    let resumeGameCounter = 0
    fetcher('/gamestatus', 'GET')
    .then(resultGameStatus => {
        const gameStatus = resultGameStatus.data[0].status
        const startInterval = setInterval(() => {
            // resume the game if still ongoing 
            if(gameStatus == 'playing' && getLocStorage('uuid')) {
                qS('.acakGiliran').disabled = true
                clearInterval(startInterval)
                // get all players data
                fetcher('/gameresume', 'GET')
                .then(result => {
                    return fetcherResults(result, 'gameResume')
                })
                .catch(err => {
                    return errorCapsule(err, anErrorOccured)
                })
            }
            else if(resumeGameCounter >= 5) {
                clearInterval(startInterval)
                console.log('allPlayersLastPos stopped');
            }
            resumeGameCounter++
        }, 1000);
    })
    .catch(err => {
        return errorCapsule(err, anErrorOccured)
    })
}

function gameResume(result) {
    const mods = result.data.mods
    const playersPlaying = result.data.resumePlayer
    const tempPlayerTurns = []
    const tempPlayerPos = []
    let giliranCounter = null
    // make sure no weird player is joining the game
    const areYouPlaying = playersPlaying.map(v => {return v.user_id.username}).indexOf(myGameData.username)
    if(areYouPlaying == -1) {
        errorNotification('Anda tidak sedang bermain.. akwoakwoak')
        return feedbackTurnOff()
    }
    // empty urutan text
    const urutanGiliran = qS('.urutanGiliran')
    urutanGiliran.innerText = ``
    for(let i in playersPlaying)  {
        // refill giliranCounter
        if(playersPlaying[i].jalan === true) 
            giliranCounter = playersPlaying[i].giliran
        // refill required data for your user
        if(playersPlaying[i].user_id.username == myGameData.username) {
            // set laps text
            const putaranTeks = qS('.putaranTeks')
            putaranTeks.childNodes[0].nodeValue = `Putaran ${playersPlaying[i].putaran}`
            // set myBranchChance
            myBranchChance.username = playersPlaying[i].user_id.username
            // if user pos is in the branch, set chance to 1 
            if(playersPlaying[i].pos.match(/\d+a/))
                myBranchChance.chance = 1
            else
                myBranchChance.chance = 100
        }
        // get giliran to refill playersTurn
        tempPlayerTurns.push(playersPlaying[i].giliran)
        tempPlayerPos.push(playersPlaying[i].pos)
        // refill playersTurnObj for playerlist
        playersTurnObj[i] = {
            username: playersPlaying[i].user_id.username,
            pos: playersPlaying[i].pos,
            harta_uang: playersPlaying[i].harta_uang,
            harta_kota: playersPlaying[i].harta_kota,
            kartu: playersPlaying[i].kartu
        }
        // refill player pre money
        playersPreMoney[i] = {
            username: playersPlaying[i].user_id.username,
            harta_uang: playersPlaying[i].harta_uang
        }
    }
    // sort player turns from lowest giliran -> highest
    tempPlayerTurns.sort()
    // refill playersTurn array value
    for(let i in tempPlayerTurns) {
        playersTurn.push(playersPlaying[i].user_id.username)
        // set playersTurnId to select nextPlayer on playerTurnEnd
        const adjustPlayerTurnId = playersPlaying.map(v => {return v.user_id.username}).indexOf(playersTurn[i])
        if(adjustPlayerTurnId != -1) {
            playersTurnId.push(playersPlaying[adjustPlayerTurnId].user_id.id)
        }
    }
    // recreate player list
    createPlayerList()
    // if no player, then stop right here
    if(playersTurn.length == 0) return
    // create player characters
    createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[0], cE('img'), 'img/bulet.png', 'stick1', tempPlayerPos[0])
    createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[1], cE('img'), 'img/kotak.png', 'stick2', tempPlayerPos[1])
    playersTurn[2] == null ? null : createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[2], cE('img'), 'img/segitiga.png', 'stick3', tempPlayerPos[2])
    playersTurn[3] == null ? null : createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[3], cE('img'), 'img/diamond.png', 'stick4', tempPlayerPos[3])
    playersTurn[4] == null ? null : createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[4], cE('img'), 'img/tabung.png', 'stick5', tempPlayerPos[4])
    // create player home and hotels
    placeHomeAndHotelOnCity(playersPlaying)
    // run infoButton
    interactWithButtons(mods, 'playing')
    // notif game resume
    feedbackTurnOn('melanjutkan kembali game...')
    feedbackTurnOff()
    // enable kocok dadu for the current player
    kocokDaduToggle(mods, giliranCounter)
}