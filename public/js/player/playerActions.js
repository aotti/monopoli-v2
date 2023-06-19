// get shape for the current player turn
function thisShapeIsMe(username) {
    // get all player shapes
    for(let player of qSA('.pdiv')) {
        // find the shape id that have the same name as player username
        if(player.id == username) 
            // get that shape
            return player
    }
}

// dice number system
function getDiceNumber() {
    const daduParts = {
        one: {
            chance: 30,
            number: [1,2,3]
        },
        two: {
            chance: 100,
            number: [4,5,6]
        }
    }
    const daduChance = Math.floor(Math.random() * 100)
    if(daduChance <= daduParts.one.chance) {
        const pickNumber = Math.floor(Math.random() * daduParts.one.number.length)
        return daduParts.one.number[pickNumber]
    }
    else if(daduChance >= daduParts.one.chance && daduChance <= daduParts.two.chance) {
        const pickNumber = Math.floor(Math.random() * daduParts.two.number.length)
        return daduParts.two.number[pickNumber]
    }
}

// toggle kocok dadu button, so the next player can moves
function kocokDaduToggle(giliran, mods) {
    if(myGameData.username != null) {
        console.log(`giliranCounter: ${giliran}`);
        // check whose turn is it now and enable the kocok dadu button
        if(myGameData.username === playersTurn[giliran]) {
            qS('.acakDadu').disabled = false
            qS('.acakDaduTeks').innerText = 'Giliran Anda'
            // roll the dice
            kocokDaduTrigger(giliran, mods)
        }
        // else disable it
        else {
            qS('.acakDadu').disabled = true
            qS('.acakDaduTeks').innerText = 'Belum Giliran'
        }
    }
}

// when player click the kocok dadu button
function kocokDaduTrigger(giliran, mods, customDadu = null) {
    qS('.acakDadu').onclick = () => {
        // disable after click
        qS('.acakDadu').disabled = true
        // anticipate if someone play on browser then changed the button disabled to false
        if(myGameData.username !== playersTurn[giliran]) {
            qS('.acakDadu').disabled = true
            feedbackTurnOn('Orang curang kuburannya di meikarta')
            return feedbackTurnOff()
        }
        // run player moves with realtime
        // roll the dice
        const playerDadu = customDadu || getDiceNumber()
        // set prices for kota khusus and terkutuk
        pricesForSpecialAndCursed(playerDadu, mods)
        // roll the branch
        const mathBranch = Math.floor(Math.random() * 100)
        // on 2nd time roll branch, create new value
        if(myBranchChance.status === false)
            myBranchChance.chance = mathBranch
        // payload
        const jsonData = {
            user_id: playersTurnId[giliran],
            username: playersTurn[giliran],
            playerDadu: playerDadu,
            branch: myBranchChance.chance
        }
        // send data to server
        fetcher(`/moveplayer`, 'POST', jsonData)
        .then(result => {
            return fetcherResults(result)
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
    }
}

// player steps
function footsteps(footstep, branch = '') {
    return footstep % 28 == 0 ? 28 + branch : (footstep % 28) + branch;
}

// alter player money after get money or bought land
function alterPlayerMoney(baseMoney, alterMoney) {
    return baseMoney + alterMoney
}

// move player to other lands
function movePlayerToOtherLand(mods, giliran, branchChance, steps, steps2, playersTurnShape, playerLaps) {
    for(let land of qSA('[class^=petak]')) {
        if(mods[0].board_shape == 'bercabangDua') {
            // if the next land number == our next pos
            if(branchChance <= mods[0].branch && (steps%28 == 0 || steps%28 == 1 || steps%28 == 2 || steps%28 == 14 || steps%28 == 15 || steps%28 == 16))
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
    if((steps % 28) + steps2 == 1 + steps2 && playersTurnShape.id == myGameData.username && playersTurn[giliran] == myGameData.username) {
        oneTimeStatus.throughStart = true
        qS('.putaranTeks').childNodes[0].nodeValue = `Putaran ${++playerLaps}`
    }
}

// player pos after dice rolled
function getDiceMove(mods, playerPosNow, playerDadu) {
    // get the pos after roll
    const tempDiceMove = footsteps(playerPosNow + playerDadu)
    let tempPlayerDice = null
    // if we go inside branch, add letter 'a' to the dice value  
    if(mods[0].board_shape == 'bercabangDua' && branchChance <= mods[0].branch && (tempDiceMove == 1 || tempDiceMove == 2 || tempDiceMove == 14 || tempDiceMove == 15 || tempDiceMove == 16 || tempDiceMove == 28))
        tempPlayerDice = tempDiceMove + 'a'
    // if outside branch, nothing to add
    else
        tempPlayerDice = tempDiceMove
    // return the dice value
    return tempPlayerDice
}

// player realtime moving
function playerMoves(mods, giliran, playerDadu, playersTurnShape, playerLaps) {
    // my pos right now
    const playerPosNow = +playersTurnShape.parentElement.classList[0].match(/\d+/)
    // dice animation
    const daduAnimasi = qS('#dice1')
    // my pos after roll dice
    const playerDiceMove = getDiceMove(mods, playerPosNow, playerDadu)
    // steps counter
    let steps = 0, stepsCounter = 0
    // display dice roll number if the number is <= 6
    if(playerDadu <= 6) {
        // make the 3d dice visible
        daduAnimasi.style.visibility = 'visible';
        for(let i=1; i<=6; i++) {
            // roll animation
            daduAnimasi.classList.remove(`show-${i}`);
            // when the 3d dice number == playerDadu, show the dice number
            if(i == playerDadu) {
                daduAnimasi.classList.add(`show-${i}`);
                // reset 3d dice after few seconds
                setTimeout(() => {
                    daduAnimasi.style.visibility = 'hidden';
                    daduAnimasi.classList.remove(`show-${i}`);
                }, playerDadu <= 3 ? 4000 : 6000);
            }
        }
    }
    // if dice number > 6 only display text
    else
        qS('.acakDaduTeks').innerText = `Angka Dadu: ${playerDadu}`
    // display branch number
    qS('.acakGiliranTeks').innerText = `Cabang: ${branchChance}`
    // start moving the player
    let moveDelay = 0
    const startInterval = setInterval(() => { moveDelay < 2 ? moveDelay++ : playerMoving() }, 500)
    function playerMoving() {
        // steps used to sync with the next land number
        // stepsCounter + 1 cuz the loop stops before we can get the last increment
        steps = playerPosNow + (stepsCounter + 1)
        // for lands in branch
        let steps2 = null
        // move player to other lands
        movePlayerToOtherLand(mods, giliran, branchChance, steps, steps2, playersTurnShape, playerLaps)
        // the stepsCounter value is 0
        stepsCounter++
        // loop stops and the stepsCounter value is 1
        if(stepsCounter == playerDadu) {
            // player turn end
            clearInterval(startInterval)
            // ONLY PLAYER IN TURN THAT CAN FETCH
            if(playersTurnShape.id == myGameData.username && playersTurn[giliran] == myGameData.username) {
                console.log(`fetch player: ${playersTurn[giliran]};${playersTurnShape.id};${myGameData.username}`);
                // reset myBranchChance status back to TRUE inside branch lands
                // to prevent moving to different branch
                if(myBranchChance.username == playersTurn[giliran]) {
                    // reset status on land numbers 
                    switch(true) {
                        // 14 15 16 
                        case steps%28 > 13 && steps%28 < 17:
                        // 28 1 2
                        case steps%28 >= 0 && steps%28 < 3:
                            myBranchChance.status = true
                            break
                    }
                }
                const currentPlayersTurnObj = playersTurnObj.map(v => {return v.username}).indexOf(myGameData.username)
                // player money 
                const currentMoney = playersTurnObj[currentPlayersTurnObj].harta_uang
                let endTurnMoney = currentMoney
                // player money if walkthrough start
                if(oneTimeStatus.throughStart === true)
                    endTurnMoney = alterPlayerMoney(currentMoney, 25_000)
                // ### CEK SEMUA PETAK 
                const landsAction = new Promise((resolve, reject) => {
                    const dataAfterLandEvent = steppedOnAnyLand(playersTurnShape, endTurnMoney, playerLaps)
                    if(dataAfterLandEvent == null) 
                        return playerTurnEnd(giliran, playerDiceMove, endTurnMoney, playerLaps)
                    const { buttons, data } = dataAfterLandEvent
                    for(let button of buttons) {
                        button.onclick = (ev) => {
                            qS('.confirm_box').remove()
                            // save retrieved data
                            let eventData = null
                            data.selectedButton = ev.target.classList[0]
                            switch(data.event) {
                                case 'buyingCity':
                                    eventData = buyingCityEvent(endTurnMoney, data)
                                    break
                            }
                            return resolve(eventData)
                        }
                    }
                })
                landsAction.then(eventData => {
                    playerTurnEnd(giliran, playerDiceMove, endTurnMoney, playerLaps, eventData)
                })
            }
        }
    }
}

function playerTurnEnd(giliran, playerDiceMove, endTurnMoney, playerLaps, eventData) {
    // choose next player
    const nextPlayer = (giliran + 1) % playersTurnId.length
    // payload
    const jsonData = {
        user_id: myGameData.id,
        pos: `${playerDiceMove}`,
        harta_uang: endTurnMoney,
        harta_kota: '',
        kartu: '',
        jalan: false,
        penjara: false,
        putaran: (oneTimeStatus.throughStart === true ? ++playerLaps : playerLaps),
        next_player: playersTurnId[nextPlayer]
    }
    // send data to server
    fetcher(`/turnend`, 'PATCH', jsonData)
    .then(result => {
        // set back value to false
        oneTimeStatus.throughStart = false
        return fetcherResults(result)
    })
    .catch(err => {
        return errorCapsule(err, anErrorOccured)
    })
}