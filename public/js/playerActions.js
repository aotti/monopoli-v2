// get all player last position
function allPlayersLastPos() {
    
}

// get shape for the current player turn
function thisShapeIsMe() {
    for(let player of qSA('.pdiv')) {
        if(player.id == playersTurn[giliranCounter]) 
            playersTurnShape = player
    }
}

// toggle kocok dadu button, so the next player can moves
function kocokDaduToggle() {
    if(myGameData.username != null) {
        // get shape element for each player
        thisShapeIsMe()
        // check whose turn is it now and enable the kocok dadu button
        if(playersTurn[giliranCounter] == myGameData.username) {
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
        // anticipate if someone play on browser then changed the button disabled to false
        if(playersTurn[giliranCounter] != myGameData.username) {
            qS('.acakDadu').disabled = true
            feedbackTurnOn('Orang curang kuburannya di meikarta')
            return feedbackTurnOff()
        }
        // run player moves with realtime
        // roll the dice
        const playerDadu = customDadu || Math.floor(Math.random() * 6) + 1
        fetcher(`${url}/api/moveplayer`, 'POST', {playerDadu: playerDadu})
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

// player realtime moving
function playerMoves(playerDadu) {
    // start moving player
    // ### add tempMoveChance later for bercabangDua map ###
    // my pos right now
    const playerPosNow = +playersTurnShape.parentElement.classList[0].match(/\d+/)
    // dice animation
    const daduAnimasi = null
    // my pos after roll dice
    const playerDiceMove = (playerPosNow + playerDadu) % 28 == 0 ? 28 : ((playerPosNow + playerDadu) % 28)
    // steps counter
    let steps = 0, stepsCounter = 0
    // display dice roll number
    qS('.acakDaduTeks').innerText = `Angka Dadu: ${playerDadu}`
    // start moving the player
    startInterval = setInterval(() => { playerMoving() }, 500)
    function playerMoving() {
        // steps used to sync with the next land number
        // stepsCounter + 1 cuz the loop stops before we can get the last increment
        steps = playerPosNow + (stepsCounter + 1)
        for(let land of qSA('[class^=petak]')) {
            // if the next land number == our next pos
            if(land.title == (steps % 28 == 0 ? 28 : steps % 28))
                // move our shape to next land
                land.appendChild(playersTurnShape)
        }
        // the stepsCounter value is 0
        stepsCounter++
        // loop stops and the stepsCounter value is 1
        if(stepsCounter == playerDadu) {
            console.log(`${playersTurn[giliranCounter]} moving done`);
            clearInterval(startInterval)
            // increment for next player
            giliranCounter += 1
            if(giliranCounter == playersTurn.length)
                giliranCounter = 0
            // player turn end
            const jsonData = {
                username: playersTurn[giliranCounter],
                harta: +mods[1],
                pos: playerDiceMove,
                kartu: '',
                giliran: giliranCounter,
                penjara: false
            }
            fetcher(`${url}/api/turnend`, 'PATCH', jsonData)
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