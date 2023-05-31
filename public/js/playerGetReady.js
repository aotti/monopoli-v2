// by clicking Kocok Giliran, player get random number
// higher number = first turn
function decidePlayersTurn() {
    const acakGiliranButton = qS('.acakGiliran')
    const acakGiliranTeks = qS('.acakGiliranTeks')
    const userName = qS('.userName')
    acakGiliranButton.onclick = () => {
        // only can click the button if the game status is (unready)
        if(gameStatus != 'unready') {
            feedbackTurnOn('tidak bisa join, game sudah dimulai')
            return feedbackTurnOff()
        }
        // if the username meet requirements
        if(userName.value.length >= 4 && userName.value.match(/^[a-zA-Z]+$/)) {
            acakGiliranButton.disabled = true;
            // disable the username after click acakGiliranButton
            userName.style.boxShadow = '';
            userName.disabled = true;
            userName.readOnly = true
            // generate rand number
            const randNumber = Math.floor(Math.random() * (10001 - 1000)) + 1000;
            // display rand number after click acakGiliranButton
            acakGiliranTeks.innerText = `Angka: ${randNumber}`
            // payload
            const jsonData = { randNumber: randNumber, username: userName.value }
            // send data to server
            fetcher(`/api/prepare`, 'POST', jsonData)
            .then(data => data.json())
            .then(result => {
                // if response status != 200, then display it to the screen
                if(result.status != 200) {
                    if(typeof result.errorMessage === 'object') {
                        // error when player using the same username
                        if(result.errorMessage.message?.match(/duplicate.key.value/)) {
                            errorNotification(`username sudah dipakai\n`)
                            acakGiliranButton.disabled = false;
                            userName.disabled = false;
                            return feedbackTurnOff()
                        }
                        // other error
                        else 
                            return errorCapsule(result, `an error occured\n`)
                    }
                    // error when data type is wrong
                    if(result.errorMessage.match(/cannot.be.null/)) {
                        errorNotification(`randNumber/username null\n`)
                        acakGiliranButton.disabled = false;
                        userName.disabled = false;
                        return
                    }
                    // other error
                    else {
                        return errorCapsule(result, `an error occured\n`)
                    }
                }
            })
            .catch(err => {
                return errorCapsule(err, `an error occured\n`)
            })
        }
        // if dont meet reqs
        else {
            feedbackTurnOn('Harus 4-8 huruf dan tidak boleh ada spasi\n')
            userName.value = '';
            userName.placeholder = '4-8 Huruf!';
            userName.style.boxShadow = '0 0 10px crimson';
            feedbackTurnOff()
        }
    } 
}

// waiting other player to join
function waitingOtherPlayers(otherPlayers) {
    const urutanGiliran = qS('.urutanGiliran')
    // for player rand numbers
    let tempPlayerTurns = []
    // for setInterval
    let startInterval = null
    // insert players number to the array
    for(let v of otherPlayers)
        tempPlayerTurns.push(v.player_rand)
    // check how many players joined
    switch(otherPlayers.length) {
        // case 1 player joined
        case 1:
            // waiting more players 
            urutanGiliran.innerText = `${otherPlayers.length} player waiting..`
            break
        // case 2 ~ 4 player joined
        case 2: case 3: case 4:
            // to count how many player forcing
            let forceCounter = 0
            // to prevent paksaMulai button (disable = true) back to (disable = false) 
            let paksaMulaiDisable = false
            otherPlayers.forEach(v => {
                if(v.player_forcing === true) {
                    forceCounter += 1
                    // if player clicked paksa mulai, the button gonna be disable again
                    if(v.player_joined == myGameData.username)
                        paksaMulaiDisable = true
                }
            })
            // showing how many player waiting and agree to force start
            urutanGiliran.innerText = `${otherPlayers.length} player waiting..\n${forceCounter} player memaksa..`
            // paksa mulai button enabled if player havent click yet
            qS('.paksaMulai').disabled = paksaMulaiDisable
            qS('.paksaMulai').onclick = (ev) => {
                // disable after click
                ev.target.disabled = true
                // if the player data who forced is exist in database
                const theOtherPlayer = otherPlayers.map(v => {return v.player_joined}).indexOf(myGameData.username)
                // then that player allowed to force start
                forceStartGame(otherPlayers[theOtherPlayer])
            }
            // prepare the game
            if(otherPlayers.length == forceCounter) {
                let timer = 6
                startInterval = setInterval(() => {
                    // ONLY SEND ONCE, TO PREVENT REALTIME LIMIT USAGE
                    if(timer == 6) {
                        // update game status to ready
                        fetcher(`/api/gamestatus`, 'PATCH', {gameStatus: 'ready'})
                        .then(data => data.json())
                        .then(result => {
                            if(result.status == 200) {
                                getGameStatus(false)
                            }
                            else if(result.status != 200) {
                                return errorCapsule(result, `an error occured\n`)
                            }
                        })
                        .catch(err => {
                            return errorCapsule(err, `an error occured\n`)
                        })
                    }
                    // display force start countdown
                    urutanGiliran.innerText = `Game terpaksa dimulai dalam . . . ${timer}`
                    timer--
                    // stop force start interval
                    if(timer < 0) {
                        clearInterval(startInterval)
                        // sort player rand numbers
                        tempPlayerTurns.sort().reverse()
                        for(let v of tempPlayerTurns) {
                            // if the rand number is exists 
                            const adjustPlayerTurn = otherPlayers.map(v => {return v.player_rand}).indexOf(v)
                            // insert username to playerTurns 
                            if(adjustPlayerTurn != -1)
                                playersTurn.push(otherPlayers[adjustPlayerTurn].player_joined)
                        }
                        createPlayersAndGetReady(otherPlayers)
                    }
                }, 1000);
            }
            break
        // case 5 player joined
        case 5:
            // prepare the game
            if(startInterval != null)
                clearInterval(startInterval)
            // disable paksaMulai button
            qS('.paksaMulai').disabled = true
            // sort player rand numbers
            tempPlayerTurns.sort().reverse()
            for(let v of tempPlayerTurns) {
                // if the rand number is exists 
                const adjustPlayerTurn = otherPlayers.map(v => {return v.player_rand}).indexOf(v)
                // insert username to playerTurns 
                if(adjustPlayerTurn != -1)
                    playersTurn.push(otherPlayers[adjustPlayerTurn].player_joined)
            }
            // start creating the player order by sorted rand number
            createPlayersAndGetReady(otherPlayers)
            break
    }
}

// tell all player when someone is wanna force start 
function forceStartGame(theOtherPlayer) {
    // send data to server
    fetcher(`/api/forcestart`, 'PATCH', {username: theOtherPlayer.player_joined})
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

// create the player characters
function createPlayerShape(playerDiv, playerDivClass, username, playerShape, imgSource, imgClass) {
    // get all lands
    const getLands = qSA('[class^=petak]');
    // set img attributes
    playerShape.src = imgSource;
    playerShape.classList.add(imgClass);
    // set player container attributes
    playerDiv.id = username;
    playerDiv.classList.add(playerDivClass);
    // append img to player container
    playerDiv.appendChild(playerShape);
    // append player container to board
    (mods[0] == 'persegiPanjangV2' ? 
        getLands[18].appendChild(playerDiv) 
        : 
        (getLands[33] != null ? 
            getLands[33].appendChild(playerDiv) 
            : 
            getLands[27].appendChild(playerDiv))
    );
}

// create player and getting ready
function createPlayersAndGetReady() {
    // if no player, then stop right here
    if(playersTurn.length == 0) return
    // create player characters
    createPlayerShape(cE('div'), 'pdiv', playersTurn[0], cE('img'), 'img/bulet.png', 'stick1')
    createPlayerShape(cE('div'), 'pdiv', playersTurn[1], cE('img'), 'img/kotak.png', 'stick2')
    playersTurn[2] == null ? null : createPlayerShape(cE('div'), 'pdiv', playersTurn[2], cE('img'), 'img/segitiga.png', 'stick3')
    playersTurn[3] == null ? null : createPlayerShape(cE('div'), 'pdiv', playersTurn[3], cE('img'), 'img/diamond.png', 'stick4')
    playersTurn[4] == null ? null : createPlayerShape(cE('div'), 'pdiv', playersTurn[4], cE('img'), 'img/tabung.png', 'stick5')
    // set up the game
    const urutanGiliran = qS('.urutanGiliran')
    // set text for player order list
    let urutanTeks = `Urutan Giliran`
    for(let i in playersTurn) 
        urutanTeks += `\n#${+i + 1} - ${playersTurn[i]}`
    // display the player order list
    urutanGiliran.innerText = urutanTeks
    // enable tombolMulai button
    qS('.tombolMulai').disabled = false
    qS('.tombolMulai').onclick = () => {
        // disable tombolMulai after clicked
        qS('.tombolMulai').disabled = true
        // anticipate if someone play on browser then changed the button disabled to false
        if(gameStatus != 'ready') {
            feedbackTurnOn('Orang curang kuburannya di meikarta')
            return feedbackTurnOff()
        }
        // temp var to decide player turns
        let tempGiliran = null
        for(let p in playersTurn) {
            // set player turn based on array index
            if(playersTurn[p] == myGameData.username)
                tempGiliran = +p
        }
        // payload
        const jsonData = {
            username: myGameData.username,
            pos: '1',
            harta_uang: +mods[1],
            harta_kota: '',
            kartu: '',
            giliran: tempGiliran,
            jalan: (tempGiliran == 0 ? true : false),
            penjara: false
        }
        // send data to server
        fetcher(`/api/ready`, 'POST', jsonData)
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

// waiting other player to click Mulai button
function gettingReady(readyPlayers) {
    // waiting other player to get ready
    const urutanGiliran = qS('.urutanGiliran')
    let urutanTeks = `Urutan Giliran`
    for(let i in playersTurn) 
        urutanTeks += `\n#${+i + 1} - ${playersTurn[i]}`
    // display how many player are ready
    urutanGiliran.innerText = `${urutanTeks}\n${readyPlayers.length} player sudah siap..`
    // if all player is ready, start the game
    if(playersTurn.length == readyPlayers.length) {
        let timer = 4
        const startInterval = setInterval(() => {
            // ONLY SEND ONCE, TO PREVENT REALTIME LIMIT USAGE
            if(timer == 4) {
                // update game status
                fetcher(`/api/gamestatus`, 'PATCH', {gameStatus: 'playing'})
                .then(data => data.json())
                .then(result => {
                    if(result.status == 200) {
                        getGameStatus(false)
                    }
                    else if(result.status != 200) {
                        return errorCapsule(result, `an error occured\n`)
                    }
                })
                .catch(err => {
                    return errorCapsule(err, `an error occured\n`)
                })
            }
            // display game start countdown
            urutanGiliran.innerText = `game dimulai dalam . . ${timer}`
            timer--
            if(timer < 0) {
                clearInterval(startInterval)
                urutanGiliran.innerText = ``
                // run this function after the timer is out 
                // to trigger the first move cuz the myGameData.username is considered null
                kocokDaduToggle()
            }
        }, 1000);
    }
}
