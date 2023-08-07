// by clicking Kocok Giliran, player get random number
// higher number = first turn
function checkGameStatus() {
    const acakGiliranButton = qS('.acakGiliran')
    acakGiliranButton.onclick = () => {
        fetcher('/gamestatus', 'GET')
        .then(result => {
            // deciding the turn for each player
            decidePlayersTurn(result.data[0].status)
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
    } 
}

// deciding the turn for each player
function decidePlayersTurn(gameStatus) {
    const acakGiliranTeks = qS('.acakGiliranTeks')
    const userName = qS('.userName')
    // only can click the button if the game status is (unready)
    // lightgrey = unready ; yellow = ready ; lawngreen = playing ; red = game over
    if(gameStatus != 'unready') {
        feedbackTurnOn('tidak bisa join, game sudah dimulai')
        return feedbackTurnOff()
    }
    // if the player hasnt login
    if(myGameData.uuid == null) {
        feedbackTurnOn('anda belum login')
        return feedbackTurnOff()
    }
    qS('.acakGiliran').disabled = true;
    userName.style.boxShadow = '0 0 10px blue';
    // generate rand number
    const randNumber = Math.floor(Math.random() * (10001 - 1000)) + 1000;
    // display rand number after click acakGiliranButton
    acakGiliranTeks.innerText = `Angka: ${randNumber}`
    // payload
    const jsonData = { randNumber: randNumber, username: myGameData.username }
    // send data to server
    fetcher(`/prepare`, 'POST', jsonData)
    .then(result => {
        return fetcherResults(result)
    })
    .catch(err => {
        return errorCapsule(err, anErrorOccured)
    })
}

// waiting other player to join
function waitingOtherPlayers(otherPlayers, mods, gameStatus) {
    // insert username to playerTurns 
    function playersTurnPush() {
        // sort player rand numbers
        tempPlayerTurns.sort().reverse()
        for(let v of tempPlayerTurns) {
            // if the rand number is exists 
            const adjustPlayerTurn = otherPlayers.map(v => {return v.player_rand}).indexOf(v)
            // insert username to playerTurns 
            if(adjustPlayerTurn != -1)
                playersTurn.push(otherPlayers[adjustPlayerTurn].player_joined)
        }
    }
    const urutanGiliran = qS('.urutanGiliran')
    // for setInterval
    let startInterval = null
    // for player rand numbers
    let tempPlayerTurns = []
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
            // ### TAMBAH KONDISI UNTUK MENGHINDARI DI KLIK LAGI SAAT GAMESTATUS = PLAYING
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
                        updateGameStatus('ready')
                        gameStatus[0].status = 'ready'
                    }
                    // display force start countdown
                    urutanGiliran.innerText = `Game terpaksa dimulai dalam . . . ${timer}`
                    timer--
                    // stop force start interval
                    if(timer < 0) {
                        clearInterval(startInterval)
                        // insert username to playerTurns 
                        playersTurnPush()
                        // start creating the player order by sorted rand number
                        createPlayersAndGetReady(mods, gameStatus)
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
            // update game status to ready
            updateGameStatus('ready')
            gameStatus[0].status = 'ready'
            // insert username to playerTurns 
            playersTurnPush()
            // start creating the player order by sorted rand number
            createPlayersAndGetReady(mods, gameStatus)
            break
    }
}

// tell all player when someone is wanna force start 
function forceStartGame(theOtherPlayer) {
    // send data to server
    fetcher(`/forcestart`, 'PATCH', {username: theOtherPlayer.player_joined})
    .then(result => {
        return fetcherResults(result)
    })
    .catch(err => {
        return errorCapsule(err, anErrorOccured)
    })
}

// create the player characters
function createPlayerShape(mods, playerDiv, playerDivClass, username, playerShape, imgSource, imgClass, resumePos = null) {
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
    if(resumePos) {
        for(let land of getLands) {
            if(land.title == resumePos) {
                // move our shape to the last pos
                return land.appendChild(playerDiv)
            }
        }
    }
    // mods need index 0 to use, ex: mods[0].branch / mods[0].board_shape
    (mods[0].board_shape == 'persegiPanjangV2' 
    ? getLands[18].appendChild(playerDiv) 
    : (getLands[33] 
        ? getLands[33].appendChild(playerDiv) 
        : getLands[27].appendChild(playerDiv))
    );
}

// create player and getting ready
function createPlayersAndGetReady(mods, gameStatus) {
    // if no player, then stop right here
    if(playersTurn.length == 0) return
    // create player characters
    createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[0], cE('img'), 'img/bulet.png', 'stick1')
    createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[1], cE('img'), 'img/kotak.png', 'stick2')
    playersTurn[2] == null ? null : createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[2], cE('img'), 'img/segitiga.png', 'stick3')
    playersTurn[3] == null ? null : createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[3], cE('img'), 'img/diamond.png', 'stick4')
    playersTurn[4] == null ? null : createPlayerShape(mods, cE('div'), 'pdiv', playersTurn[4], cE('img'), 'img/tabung.png', 'stick5')
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
        // gameStatus need index 0 to use, ex: gameStatus[0].status
        if(gameStatus[0].status != 'ready') {
            feedbackTurnOn('Orang curang kuburannya di meikarta')
            return feedbackTurnOff()
        }
        // tempGiliran to decide player turns
        const tempGiliran = playersTurn.indexOf(myGameData.username)
        // payload
        // mods need index 0 to use, ex: mods[0].branch / mods[0].board_shape
        const jsonData = {
            user_id: myGameData.id,
            username: myGameData.username,
            pos: '1',
            harta_uang: mods[0].money_start,
            harta_kota: '',
            kartu: '',
            giliran: tempGiliran,
            jalan: (tempGiliran == 0 ? true : false),
            penjara: false,
            putaran: 1
        }
        console.log(jsonData);
        // send data to server
        fetcher(`/ready`, 'POST', jsonData)
        .then(result => {
            return fetcherResults(result)
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
    }
}

// create player list
function createPlayerList() {
    const playerList = qS('.player_list')
    for(let i in playersTurnObj) {
        const listSpan_1 = cE('span')
        const listSpan_2 = cE('span')
        const listSpan_3 = cE('span')
        const cardBox = cE('ul')
        if(playersTurnObj[i].username == myGameData.username) {
            listSpan_1.style.background = 'lightblue';
            listSpan_2.style.background = 'lightblue';
            listSpan_3.style.background = 'lightblue';
        }
        // player list username span
        listSpan_1.setAttribute('data-name', playersTurnObj[i].username)
        listSpan_1.innerText = `${+i + 1}. ${playersTurnObj[i].username}`
        // player list money span
        listSpan_2.classList.add('uangPlayer')
        listSpan_2.innerText = `Rp ${currencyComma(playersTurnObj[i].harta_uang)}`
        // player list cards
        listSpan_3.classList.add('kartuBuffDebuff')
        cardBox.classList.add('kartuBuffDebuffList')
        for(let card of playersTurnObj[i].kartu.split(';')) {
            const li = cE('li')
            li.innerText = card 
            cardBox.appendChild(li)
        }
        listSpan_3.appendChild(cardBox)
        playerList.appendChild(listSpan_1);
        playerList.appendChild(listSpan_2);
        playerList.appendChild(listSpan_3);
    }
}

// waiting other player to click Mulai button
function gettingReady(readyPlayers, mods) {
    // waiting other player to get ready
    const urutanGiliran = qS('.urutanGiliran')
    const putaranTeks = qS('.putaranTeks')
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
                updateGameStatus('playing')
            }
            // display game start countdown
            urutanGiliran.innerText = `game dimulai dalam . . ${timer}`
            timer--
            if(timer < 0) {
                clearInterval(startInterval)
                // run infoButton
                interactWithButtons(mods, 'playing')
                // create player list
                createPlayerList()
                // set playersTurnId to select nextPlayer on playerTurnEnd
                for(let v of playersTurn) {
                    const adjustPlayerTurnId = readyPlayers.map(v => {return v.user_id.username}).indexOf(v)
                    if(adjustPlayerTurnId != -1) {
                        playersTurnId.push(readyPlayers[adjustPlayerTurnId].user_id.id)
                    }
                }
                // empty urutan text
                urutanGiliran.innerText = ``
                // set laps text
                putaranTeks.childNodes[0].nodeValue = `Putaran 1`
                // enable kocok dadu for the current player
                kocokDaduToggle(mods, 0)
            }
        }, 1000);
    }
}
