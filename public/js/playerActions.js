// get all player last position
function allPlayersLastPos() {
    startInterval = setInterval(() => {
        // waiting gameStatus get value
        if(gameStatus != null) {
            clearInterval(startInterval)
            // resume the game if still ongoing 
            if(gameStatus == 'playing') {
                // get all players data
                fetcher()
            }
        }
    }, 1000);
}

// get shape for the current player turn
function thisShapeIsMe(username) {
    for(let player of qSA('.pdiv')) {
        if(player.id == username) 
            return player
    }
}

// toggle kocok dadu button, so the next player can moves
function kocokDaduToggle() {
    if(myGameData.username != null) {
        console.log(`giliranCounter: ${giliranCounter}`);
        // check whose turn is it now and enable the kocok dadu button
        if(myGameData.username === playersTurn[giliranCounter]) {
            qS('.acakDadu').disabled = false
            qS('.acakDaduTeks').innerText = 'Giliran Anda'
        }
        // else disable it
        else {
            qS('.acakDadu').disabled = true
            qS('.acakDaduTeks').innerText = 'Belum Giliran'
        }
    }
}

// when player click the kocok dadu button
function kocokDaduTrigger(customDadu = null) {
    qS('.acakDadu').onclick = () => {
        qS('.acakDadu').disabled = true
        // anticipate if someone play on browser then changed the button disabled to false
        if(myGameData.jalan !== true) {
            qS('.acakDadu').disabled = true
            feedbackTurnOn('Orang curang kuburannya di meikarta')
            return feedbackTurnOff()
        }
        // run player moves with realtime
        // roll the dice
        const playerDadu = customDadu || Math.floor(Math.random() * 6) + 1
        const mathBranch = Math.floor(Math.random() * 100)
        if(myBranchChance.firstTime === false && mathBranch > mods[5])
            myBranchChance.chance = mathBranch
        const jsonData = {
            playerDadu: playerDadu,
            username: playersTurn[giliranCounter],
            branch: myBranchChance.chance
        }
        fetcher(`/api/moveplayer`, 'POST', jsonData)
        .then(data => data.json())
        .then(result => {
            if(result.status != 200) {
                return errorCapsule(result, `an error occured\n`)
            }
        })
        .catch(err => {
            return errorCapsule(err, `an error occured\n`)
        })
    }
}

function footsteps(footstep, branch = '') {
    return footstep % 28 == 0 ? 28 + branch : (footstep % 28) + branch;
}

function getDiceMove(playerPosNow, playerDadu, tempBranchChance) {
    const tempDiceMove = footsteps(playerPosNow + playerDadu)
    let tempPlayerDice = null
    if(mods[0] == 'bercabangDua' && tempBranchChance <= mods[5] && (tempDiceMove == 1 || tempDiceMove == 2 || tempDiceMove == 14 || tempDiceMove == 15 || tempDiceMove == 16 || tempDiceMove == 28))
        tempPlayerDice = tempDiceMove + 'a'
    else
        tempPlayerDice = tempDiceMove
    return tempPlayerDice
}

// player realtime moving
function playerMoves(playerDadu, playersTurnShape, tempBranchChance) {
    // my pos right now
    const playerPosNow = +playersTurnShape.parentElement.classList[0].match(/\d+/)
    // dice animation
    const daduAnimasi = null
    // my pos after roll dice
    const playerDiceMove = getDiceMove(playerPosNow, playerDadu, tempBranchChance)
    // steps counter
    let steps = 0, stepsCounter = 0
    // display dice roll number
    qS('.acakDaduTeks').innerText = `Angka Dadu: ${playerDadu}`
    // display branch number
    qS('.acakGiliranTeks').innerText = `Cabang: ${tempBranchChance}`
    // start moving the player
    const startInterval = setInterval(() => { playerMoving() }, 500)
    function playerMoving() {
        // steps used to sync with the next land number
        // stepsCounter + 1 cuz the loop stops before we can get the last increment
        steps = playerPosNow + (stepsCounter + 1)
        let steps2 = null
        for(let land of qSA('[class^=petak]')) {
            if(mods[0] == 'bercabangDua') {
                // if the next land number == our next pos
                if(tempBranchChance <= mods[5] && (steps%28 == 0 || steps%28 == 1 || steps%28 == 2 || steps%28 == 14 || steps%28 == 15 || steps%28 == 16))
                    steps2 = 'a'
                if(land.title == footsteps(steps, steps2)) {
                    // move our shape to next land
                    land.appendChild(playersTurnShape)
                }
            }
            else {
                // if the next land number == our next pos
                if(land.title == footsteps(steps)) {
                    // move our shape to next land
                    land.appendChild(playersTurnShape)
                }
            }
        }
        // when player walk past land no.1
        if((steps % 28) + steps2 == 1 + steps2 && myGameData.username == playersTurn[giliranCounter]) {
            laps += 1
            qS('.putaranTeks').innerText = `Putaran ${laps}`
        }
        // the stepsCounter value is 0
        stepsCounter++
        // loop stops and the stepsCounter value is 1
        if(stepsCounter == playerDadu) {
            // player turn end
            clearInterval(startInterval)
            // ONLY PLAYER IN TURN THAT CAN FETCH
            if(myGameData.username == playersTurn[giliranCounter]) {
                // reset myBranchChance value outside branch lands
                if(myBranchChance.username == playersTurn[giliranCounter] && (steps % 28 > 3 && steps % 28 < 13) || (steps % 28 > 17 && steps % 28 < 27))
                    myBranchChance.chance = 100
                // choose next player
                const nextPlayer = (myGameData.giliran + 1) % playersTurn.length
                // payload
                const jsonData = {
                    username: myGameData.username,
                    pos: `${playerDiceMove}`,
                    harta_uang: +mods[1],
                    harta_kota: '',
                    kartu: '',
                    giliran: myGameData.giliran,
                    jalan: false,
                    penjara: false,
                    next_player: playersTurn[nextPlayer]
                }
                fetcher(`/api/turnend`, 'PATCH', jsonData)
                .then(data => data.json())
                .then(result => {
                    if(result.status != 200) {
                        return errorCapsule(result, `an error occured\n`)
                    }
                })
                .catch(err => {
                    return errorCapsule(err, `an error occured\n`)
                })
            }
        }
    }
}