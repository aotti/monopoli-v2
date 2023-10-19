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
    else if(daduChance > daduParts.one.chance && daduChance <= daduParts.two.chance) {
        const pickNumber = Math.floor(Math.random() * daduParts.two.number.length)
        return daduParts.two.number[pickNumber]
    }
}

// toggle kocok dadu button, so the next player can moves
function kocokDaduToggle(mods, giliran) {
    if(myGameData.username != null) {
        console.log(`giliranCounter: ${giliran}`);
        // play sounds
        switch (giliran) {
            case 0:
                qS('#pTurnOne').play()
                break
            case 1:
                qS('#pTurnTwo').play()
                break
            case 2:
                qS('#pTurnThree').play()
                break
            case 3:
                qS('#pTurnFour').play()
                break
            case 4:
                qS('#pTurnFive').play()
                break
        }
        // check whose turn is it now and enable the kocok dadu button
        if(myGameData.username === playersTurn[giliran]) {
            qS('.acakDadu').disabled = false
            qS('.acakDaduTeks').innerText = 'Giliran Anda'
            // roll the dice
            kocokDaduTrigger(mods, giliran)
            // when auto roll dice is checked
            if(qS('#awtoKocokDadu').checked)
                qS('.acakDadu').click()
        }
        // else disable it
        else {
            qS('.acakDadu').disabled = true
            qS('.acakDaduTeks').innerText = 'Belum Giliran'
        }
    }
}

// when player click the kocok dadu button
function kocokDaduTrigger(mods, giliran, customDadu = null) {
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
        const playerDadu = customDadu || 3
        // set prices for kota khusus and terkutuk
        pricesForSpecialAndCursed(playerDadu, mods)
        // roll the branch
        const mathBranch = Math.floor(Math.random() * 100)
        // on 2nd time roll branch, create new value
        if(myBranchChance.status === false)
            myBranchChance.chance = mathBranch
        // prison counter
        if(myPrisonCounter.status === true)
            myPrisonCounter.counter += playerDadu
        // payload
        const jsonData = {
            user_id: playersTurnId[giliran],
            username: playersTurn[giliran],
            playerDadu: playerDadu,
            branch: myBranchChance.chance,
            prison: myPrisonCounter.counter
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
function movePlayerToOtherLand(mods, giliran, branchChance, steps, steps2, playersTurnShape, playerLaps, playerCards) {
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
        // sell city allowed 
        oneTimeStatus.sellCity = false
        // increment the laps
        qS('.putaranTeks').childNodes[0].nodeValue = `Putaran ${++playerLaps}`
        // if player have penghambat rezeki card
        const penghambatRezeki = playerCards.indexOf('penghambat-rezeki')
        if(penghambatRezeki !== -1)
            specialCardsHandler('penghambat-rezeki', {cardStatus: true, cond: 'walking'})
        else if(penghambatRezeki === -1)
            specialCardsHandler('penghambat-rezeki', {cardStatus: false, cond: 'walking'})
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
function playerMoves(mods, giliran, playerDadu, playersTurnShape, moneyCitiesCards, playerLaps, playerImprisoned) {
    const { playerMoney, playerCities, playerCards } = moneyCitiesCards
    // my pos right now
    const playerPosNow = +playersTurnShape.parentElement.classList[0].match(/\d+/)
    // player money and cards
    let endTurnMoney = playerMoney
    let cardsOwned = playerCards
    // dice animation
    const daduAnimasi = qS('#dice1')
    // display dice roll number if the number is <= 6
    if(playerDadu > 0 && playerDadu <= 6) {
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
    else {
        qS('.acakDaduTeks').innerText = `Angka Dadu: ${playerDadu}`
    }
    // check if any dadu gaming card is exists
    const daduGamingCards = cardsOwned.match(/dadu-gaming|nerf-dadu-gaming|sad-dadu-gaming/)
    if(daduGamingCards) {
        // process the dadu gaming card 
        // const daduGamingResults = daduGamingHandler(daduGamingCards, endTurnMoney, playerDadu)
        const daduGamingResults = specialCardsHandler(
            'dadu-gamings', {cards: daduGamingCards, money: endTurnMoney, dice: playerDadu}
        )
        // re-assign the value of endTurnMoney and cardsOwned
        endTurnMoney = daduGamingResults.tempEndTurnMoney
        cardsOwned = daduGamingResults.tempCardsOwned
    }
    // display branch number
    qS('.acakGiliranTeks').innerText = `Cabang: ${branchChance}`
    // check if player is imprisoned or not
    if(playerImprisoned === true) {
        const holdMoves = getOutOfJail(mods, giliran, playersTurnShape, playerPosNow, moneyCitiesCards, playerLaps)
        // if player doesnt meet req to be free
        if(holdMoves == 'stopMoves') return
        // if player have bebas penjara card
        else if(holdMoves == 'bebasPenjaraCard') {
            cardsOwned = manageCards('bebas-penjara', true)
        }
        // if player can moves 
        if(playersTurnShape.id == myPrisonCounter.username && playersTurn[giliran] == myPrisonCounter.username) {
            myPrisonCounter.counter = 0
        }
    }
    // my pos after roll dice
    const playerDiceMove = getDiceMove(mods, playerPosNow, playerDadu)
    // steps counter
    let steps = 0, stepsCounter = 0
    // start moving the player
    let moveDelay = 0
    const startInterval = setInterval(() => { moveDelay < 2 ? moveDelay++ : playerMoving() }, 500)
    function playerMoving() {
        // steps used to sync with the next land number
        // stepsCounter + 1 cuz the loop stops before we can get the last increment
        // check if playerDadu is positive / negative
        steps = playerDadu > 0 ? playerPosNow + (stepsCounter + 1) : playerPosNow - (stepsCounter + 1)
        // for lands in branch
        let steps2 = null
        // move player to other lands
        movePlayerToOtherLand(mods, giliran, branchChance, steps, steps2, playersTurnShape, playerLaps, playerCards)
        // the stepsCounter value is 0
        stepsCounter++
        // stepsCounter value is increment by 1
        // --------------------
        // stop the interval if stepsCounter value === playerDadu (dice number)
        // Math.abs required to prevent infinity backward steps, because the dice is negative number
        if(stepsCounter === Math.abs(playerDadu)) {
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
                        // set to false (stop reset) if outside branch lands
                        default:
                            myBranchChance.status = false
                            break
                    }
                }
                // player money if walkthrough start
                if(oneTimeStatus.throughStart === true) {
                    const penghambatRezeki = playerCards.indexOf('penghambat-rezeki')
                    // if penghambat rezeki card exists
                    if(penghambatRezeki !== -1) {
                        const penghambatRezekiResults = specialCardsHandler(
                            'penghambat-rezeki', {cardStatus: true, cond: 'stopWalking', money: endTurnMoney}
                        )
                        endTurnMoney = penghambatRezekiResults.tempEndTurnMoney
                        cardsOwned = penghambatRezekiResults.tempCardsOwned
                    }
                    // if penghambat rezeki doesnt exists
                    else if(penghambatRezeki === -1) {
                        const penghambatRezekiResults = specialCardsHandler(
                            'penghambat-rezeki', {cardStatus: false, cond: 'stopWalking', money: endTurnMoney}
                        )
                        endTurnMoney = penghambatRezekiResults.tempEndTurnMoney
                        cardsOwned = penghambatRezekiResults.tempCardsOwned
                    }
                }
                // required data if land event happens
                const requiredLandEventData = {
                    mods: mods,
                    giliran: giliran,
                    endTurnMoney: endTurnMoney,
                    playerCities: playerCities,
                    playerCards: cardsOwned,
                    playersTurnShape: playersTurnShape,
                    playerDiceMove: playerDiceMove,
                    playerLaps: playerLaps
                }
                // check land event 
                landEventHandler(requiredLandEventData)
            }
        }
    }
}

// ends player turn then send data to server
function playerTurnEnd(mods, giliran, playerDiceMove, playerLaps, returnedLandEventData) {
    // land event data
    // moneyLeft and cities = must have value
    const { moneyLeft, cities, cards, cityOwner, cityTaxAmount, imprisoned } = returnedLandEventData
    // temp special cards
    console.log('endturn cards', cards);
    const tempCards = (()=>{
        if(getLocStorage('removeNerfParkir')) {
            const tempSplitPerCard = cards.split(';')
            // check if nerf parkir is used
            const removeCard = tempSplitPerCard.indexOf(getLocStorage('removeNerfParkir'))
            if(removeCard !== -1) {
                // remove the card from array 
                localStorage.removeItem('removeNerfParkir')
                tempSplitPerCard.splice(removeCard, 1)
                // turn it back into string
                return tempSplitPerCard.join(';')
            }
        }
        return cards
    })()
    // choose next player
    const nextPlayer = (()=>{
        // alive = giliran, lost = player id(s)
        const nextPlayerObj = {alive: null, lost: []}
        // find next player alive
        for(let i in playersTurn) {
            const nextPlayerMoney = checkNextPlayer(giliran, +i)
            // if the next player money >= -50_000
            if(nextPlayerMoney[0] >= -mods[0].money_lose) {
                // insert next player giliran (alive)
                nextPlayerObj.alive = nextPlayerMoney[1]
                break
            }
        }
        // find all lost players
        for(let i in playersTurn) {
            const nextPlayerMoney = checkNextPlayer(giliran, +i)
            // if the player has lost
            if(nextPlayerMoney[0] < -mods[0].money_lose) {
                // insert next player giliran (lost)
                const playerLostId = playersTurnId[nextPlayerMoney[1]]
                nextPlayerObj.lost.push(playerLostId)
            }
        }
        return nextPlayerObj
    })()
    // payload
    const jsonData = {
        // to check if current end player is losing then empty the harta_kota
        money_lose_mods: mods[0].money_lose,
        // send (recent) player id to update the database
        user_id: myGameData.id,
        // player position after all the action
        pos: `${playerDiceMove}`,
        // moneyLeft (returnedLandEventData) must always have value
        harta_uang: moneyLeft,
        // cities (returnedLandEventData) must always have value
        harta_kota: cities,
        // if cards (returnedLandEventData) not null, use the value
        kartu: cards ? tempCards : '',
        // will always false on turn end
        jalan: false,
        // if imprisoned (returnedLandEventData) not null, use the value
        penjara: imprisoned ? imprisoned : false,
        // if player walkthrough start = plus 1, else do nothing
        putaran: oneTimeStatus.throughStart === true ? ++playerLaps : playerLaps,
        // transfer money status
        transfer: oneTimeStatus.transfer,
        // selling city status
        sell_city: false,
        // nextPlayer must always have value
        next_player: playersTurnId[nextPlayer.alive],
        // all players id who have already lost
        lost_players: nextPlayer.lost,
        // pay taxes if the player steps on city that isnt belong to him/hers
        tax_payment: 
            cityOwner && cityTaxAmount ? {
                target_owner: targetOwner(cityOwner),
                target_money: moneyLeft + cityTaxAmount
            } : null
    }
    console.log(jsonData);
    // send data to server
    fetcher(`/turnend`, 'PATCH', jsonData)
    .then(result => {
        // set back walkthrough start value to false
        oneTimeStatus.throughStart = false
        return fetcherResults(result)
    })
    .catch(err => {
        return errorCapsule(err, anErrorOccured)
    })
}

// the end of the game
function gameOver(theLastPlayer) {
    updateGameStatus('done', 'system')
    qS('#pGameSelesai').play();
    qS('.acakDaduTeks').innerText = 'Selesai'
    // set game over text
    qS('.urutanGiliran').innerText = `Orang yang terakhir berdiri:\n${emoji.sweatJoy} ${theLastPlayer} ${emoji.cowboy}`
}

// data for sending tax to the city owner
function targetOwner(cityOwner) {
    const getTargetOwner = playersTurn.map(v => {return v}).indexOf(cityOwner)
    return playersTurnId[getTargetOwner]
}

// prison
function getOutOfJail(mods, giliran, playersTurnShape, playerPosNow, moneyCitiesCards, playerLaps) {
    const { playerMoney, playerCities, playerCards } = moneyCitiesCards
    // if bebas penjara card exists
    const bebasPenjara = playerCards.indexOf('bebas-penjara')
    if(bebasPenjara !== -1) {
        // set (local) prison status to false
        if(playersTurnShape.id == myPrisonCounter.username && playersTurn[giliran] == myPrisonCounter.username)
            myPrisonCounter.status = false
        feedbackTurnOn(`kartu bebas penjara terpakai, Anda bebas`)
        feedbackTurnOff()
        return specialCardsHandler('bebas-penjara')
    }
    // if prisonCounter = 1 OR more/equal than 7, player continue walking
    else if(prisonCounter === 1 || prisonCounter >= 7) {
        // set (local) prison status to false
        if(playersTurnShape.id == myPrisonCounter.username && playersTurn[giliran] == myPrisonCounter.username)
            myPrisonCounter.status = false
        feedbackTurnOn(`counter: ${prisonCounter}, Anda bebas`)
        feedbackTurnOff()
        return 'continueMoves'
    }
    // if doesnt meet reqs, end the turn
    else {
        feedbackTurnOn(`counter: ${prisonCounter}, mohon bersabar ${emoji.pray}`)
        feedbackTurnOff()
        const prisonerData = {
            moneyLeft: playerMoney,
            cities: playerCities,
            cards: playerCards,
            imprisoned: true
        }
        // getDiceMove with value 0 to prevent player from moving
        if(playersTurnShape.id == myPrisonCounter.username && playersTurn[giliran] == myPrisonCounter.username)
            playerTurnEnd(mods, giliran, getDiceMove(mods, playerPosNow, 0), playerLaps, prisonerData)
        return 'stopMoves'
    }
}

// check and get next player id
function checkNextPlayer(giliran, increment = 0) {
    // get next player giliran
    const tempNextGiliran = (giliran + (1 + increment)) % playersTurnId.length
    // find the player with username
    const tempNextPlayerIndex = playersTurnObj.map(v => {return v.username}).indexOf(playersTurn[tempNextGiliran])
    // get the next player money
    const tempNextPlayerMoney = playersTurnObj[tempNextPlayerIndex].harta_uang
    // return money and giliran
    return [tempNextPlayerMoney, tempNextGiliran]
}

// update special card box for each players
function updateCardBox(otherPlayerData) {
    const listKartu = qSA('.kartuBuffDebuffList')
    // loop all card box container (reset card box)
    for(let LK of listKartu) {
        // remove all child <li> before append new <li> elements
        while(LK.lastChild && LK.lastChild.nodeName == 'LI')
            LK.removeChild(LK.lastChild)
    }
    // loop all card box container (update card box)
    for(let LK of listKartu) {
        // find player index
        const playerIndex = otherPlayerData.map(v => {return v.user_id.username}).indexOf(LK.dataset.name)
        // match the card box data-name by player username
        if(playerIndex !== -1) {
            // get the special cards and split into array
            const tempPlayerCards = otherPlayerData[playerIndex].kartu.split(';')
            // loop the special cards
            for(let card of tempPlayerCards) {
                // create element and input the card
                const li = cE('li')
                li.innerText = card
                // append the element
                LK.appendChild(li)
            }
        }
    }
}

function specialCardsHandler(cardName, specialCardData = null) {
    switch (cardName) {
        // in steppedOnAnyLand function > stepOnParking condition
        case 'nerf-parkir':
            const tempParkingButtons = createButtonsOrTextValue('button', true)
            const tempParkingNumbers = createButtonsOrTextValue('number', true)
            // determine number that gonna be disabled (nerf half buttons)
            const disabledNumbers = []
            for(let i=0; i<14; i++) {
                const DN = Math.floor(Math.random() * 28) + 1
                disabledNumbers.push(DN)
            }
            // disable the buttons
            for(let DN of disabledNumbers) {
                // match the parking numbers with disabled numbers value
                const PN_index = tempParkingNumbers.indexOf(DN)
                // disable the button 
                if(PN_index !== -1) {
                    tempParkingButtons[PN_index].disabled = true
                }
            }
            // set the card to local storage for remove later
            setLocStorage('removeNerfParkir', 'nerf-parkir')
            return tempParkingButtons
        // in playerMoves function > after display dice number
        case 'dadu-gamings':
            const daduGamingData = specialCardData
            const daduGamingObj = {
                tempEndTurnMoney: null,
                tempCardsOwned: null
            }
            // use Math.abs to prevent negative playerDadu 
            // if sad dadu gaming exists, use it first
            const sadDaduGaming = daduGamingData.cards.indexOf('sad-dadu-gaming')
            if(sadDaduGaming !== -1) {
                daduGamingObj.tempEndTurnMoney = daduGamingData.money - (daduGamingData.dice * 5000)
                daduGamingObj.tempCardsOwned = manageCards('sad-dadu-gaming', true)
                feedbackTurnOn('kartu sad dadu gaming terpakai')
            }
            // sad dadu gaming doesnt exists
            else if(sadDaduGaming === -1) { 
                // if nerf dadu gaming is exists, use it second
                const nerfDaduGaming = daduGamingData.cards.indexOf('nerf-dadu-gaming')
                if(nerfDaduGaming !== -1) {
                    daduGamingObj.tempEndTurnMoney = daduGamingData.money + (daduGamingData.dice * 5000)
                    daduGamingObj.tempCardsOwned = manageCards('nerf-dadu-gaming', true)
                    feedbackTurnOn('kartu nerf dadu gaming terpakai')
                }
                // and dadu gaming third
                else if(nerfDaduGaming === -1) {
                    daduGamingObj.tempEndTurnMoney = daduGamingData.money + (daduGamingData.dice * 10_000)
                    daduGamingObj.tempCardsOwned = manageCards('dadu-gaming', true)
                    feedbackTurnOn('kartu dadu gaming terpakai')
                }
            }
            feedbackTurnOff()
            return daduGamingObj
        // in getOutOfJail function
        case 'bebas-penjara':
            return 'bebasPenjaraCard'
        // in movePlayerToOtherLand and playerMoves (after stepsCounter ends) function
        case 'penghambat-rezeki':
            if(specialCardData.cond == 'walking') {
                if(specialCardData.cardStatus === true) {
                    // notify player for getting 5k when walk through start
                    feedbackTurnOn(`Anda baru saja lewat start dan mendapatkan Rp 5.000`)
                    feedbackTurnOff()
                }
                else if(specialCardData.cardStatus === false) {
                    // notify player for getting 25k when walk through start
                    feedbackTurnOn(`Anda baru saja lewat start dan mendapatkan Rp 25.000`)
                    feedbackTurnOff()
                }
            }
            else if(specialCardData.cond == 'stopWalking') {
                const penghambatRezekiObj = {
                    tempEndTurnMoney: null,
                    tempCardsOwned: null
                }
                // penghambat rezeki exists, add money 5000 and remove the card
                if(specialCardData.cardStatus === true) {
                    penghambatRezekiObj.tempEndTurnMoney =  specialCardData.money + 5_000
                    penghambatRezekiObj.tempCardsOwned = manageCards('penghambat-rezeki', true)
                }
                // penghambat rezeki doesnt exists, add money 25000 and remove nothing
                else if(specialCardData.cardStatus === false) {
                    penghambatRezekiObj.tempEndTurnMoney =  specialCardData.money + 25_000
                    penghambatRezekiObj.tempCardsOwned = manageCards('penghambat-rezeki')
                }
                return penghambatRezekiObj
            }
            break
        case 'pajak-cards':
            const pajakCardsData = specialCardData
            const pajakCardsObj = {
                tempTaxAmount: null
            }
            // only check anti pajak because already filtered in playersLandAction > stepOnTax
            const antiPajak = pajakCardsData.cards.indexOf('anti-pajak')
            // if anti pajak card exists
            if(antiPajak !== -1) {
                pajakCardsObj.tempTaxAmount = pajakCardsData.taxAmount * 0
                pajakCardsObj.tempCardsOwned = manageCards('anti-pajak', true)
                feedbackTurnOn('kartu anti pajak terpakai')
            }
            // if nerf pajak card exists
            else if(antiPajak === -1) {
                pajakCardsObj.tempTaxAmount = pajakCardsData.taxAmount - (pajakCardsData.taxAmount * .3)
                pajakCardsObj.tempCardsOwned = manageCards('nerf-pajak', true)
                feedbackTurnOn(`kartu nerf pajak terpakai\nnerf: Rp ${currencyComma(pajakCardsData.taxAmount * .3)}`)
            }
            feedbackTurnOff()
            return pajakCardsObj
    }
}
