// setInterval if player forcing to start < 5 player 
let startInterval = null
// by clicking Kocok Giliran, player get random number
// higher number = first turn
function decidePlayersTurn() {
    const acakGiliranButton = qS('.acakGiliran')
    const acakGiliranTeks = qS('.acakGiliranTeks')
    const userName = qS('.userName')
    acakGiliranButton.onclick = () => {
        if(userName.value.length >= 4 && userName.value.match(/^[a-zA-Z]+$/)) {
            acakGiliranButton.disabled = true;
            userName.style.boxShadow = '';
            userName.disabled = true;
            const randNumber = Math.floor(Math.random() * (10001 - 1000)) + 1000;
            acakGiliranTeks.innerText = `Angka: ${randNumber}`
            const jsonData = { randNumber: randNumber, username: userName.value }
            fetcher(`${url}/api/prepare`, 'post', jsonData)
            .then(data => data.json())
            .then(result => {
                if(result.status == 200)
                    setLocStorage('username', userName.value)
                // if response status != 200, then display it to the screen
                else if(result.status != 200) {
                    if(typeof result.errorMessage === 'object') {
                        // error when player using the same username
                        if(result.errorMessage.message?.match(/duplicate.key.value/)) {
                            errorNotification(`username sudah dipakai\n`)
                            acakGiliranButton.disabled = false;
                            userName.disabled = false;
                            return feedbackTurnOff()
                        }
                        else 
                            return errorCapsule(result, `an error occured\n`)
                    }
                    if(result.errorMessage.match(/cannot.be.null/)) {
                        errorNotification(`randNumber/username null\n`)
                        acakGiliranButton.disabled = false;
                        userName.disabled = false;
                        return
                    }
                    else {
                        return errorCapsule(result, `an error occured\n`)
                    }
                }
            })
            .catch(err => {
                return errorCapsule(err, `an error occured\n`)
            })
        }
        else {
            qS('.feedback_box').style.opacity = 1;
            qS('.feedback_box').children[0].innerText = "Harus 4-8 huruf dan tidak boleh ada spasi\n";
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
    let tempPlayerTurns = []
    for(let v of otherPlayers)
        tempPlayerTurns.push(v.player_rand)
    switch(otherPlayers.length) {
        // case 1 player joined
        case 1:
            // waiting more players 
            urutanGiliran.innerText = `${otherPlayers.length} player waiting..`
            break
        // case 2 ~ 4 player joined
        case 2: case 3: case 4:
            let forceCounter = 0
            let paksaMulaiDisable = false
            otherPlayers.forEach(v => {
                if(v.player_forcing === true) {
                    forceCounter += 1
                    // if player clicked paksa mulai, the button gonna be disable again
                    if(v.player_joined == getLocStorage('username'))
                        paksaMulaiDisable = true
                }
            })
            // showing how many player waiting and agree to force start
            urutanGiliran.innerText = `${otherPlayers.length} player waiting..\n${forceCounter} player memaksa..`
            // paksa mulai button enabled if player havent click yet
            qS('.paksaMulai').disabled = paksaMulaiDisable
            qS('.paksaMulai').onclick = (ev) => {
                ev.target.disabled = true
                const theOtherPlayer = otherPlayers.map(v => {return v.player_joined}).indexOf(getLocStorage('username'))
                forceStartGame(otherPlayers[theOtherPlayer])
            }
            // prepare the game
            if(otherPlayers.length == forceCounter) {
                // stop force start interval
                let timer = 6
                startInterval = setInterval(() => {
                    urutanGiliran.innerText = `Game terpaksa dimulai dalam . . . ${timer}`
                    timer--
                    if(timer == -1) {
                        clearInterval(startInterval)
                        tempPlayerTurns.sort().reverse()
                        for(let v of tempPlayerTurns) {
                            const adjustPlayerTurn = otherPlayers.map(v => {return v.player_rand}).indexOf(v)
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
            qS('.paksaMulai').disabled = true
            tempPlayerTurns.sort().reverse()
            for(let v of tempPlayerTurns) {
                const adjustPlayerTurn = otherPlayers.map(v => {return v.player_rand}).indexOf(v)
                if(adjustPlayerTurn != -1)
                    playersTurn.push(otherPlayers[adjustPlayerTurn].player_joined)
            }
            createPlayersAndGetReady(otherPlayers)
            break
    }
}

function forceStartGame(theOtherPlayer) {
    fetcher(`${url}/api/forcestart`, 'post', {username: theOtherPlayer.player_joined})
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

function createPlayerShape(playerDiv, playerDivClass, username, playerShape, imgSource, imgClass) {
    const getLands = qSA('[class^=petak]');
    playerShape.src = imgSource;
    playerShape.classList.add(imgClass);
    playerDiv.id = username;
    playerDiv.classList.add(playerDivClass);
    playerDiv.appendChild(playerShape);
    (mods[0] == 'persegiPanjangV2' ? 
        getLands[18].appendChild(playerDiv) 
        : 
        (getLands[33] != null ? 
            getLands[33].appendChild(playerDiv) 
            : 
            getLands[27].appendChild(playerDiv))
    );
}

function createPlayersAndGetReady() {
    // create player characters
    if(playersTurn.length == 0) return
    createPlayerShape(cE('div'), 'pdiv', playersTurn[0], cE('img'), 'img/bulet.png', 'stick1')
    createPlayerShape(cE('div'), 'pdiv', playersTurn[1], cE('img'), 'img/kotak.png', 'stick2')
    playersTurn[2] == null ? null : createPlayerShape(cE('div'), 'pdiv', playersTurn[2], cE('img'), 'img/segitiga.png', 'stick3')
    playersTurn[3] == null ? null : createPlayerShape(cE('div'), 'pdiv', playersTurn[3], cE('img'), 'img/diamond.png', 'stick4')
    playersTurn[4] == null ? null : createPlayerShape(cE('div'), 'pdiv', playersTurn[4], cE('img'), 'img/tabung.png', 'stick5')
    // set up the game
    const urutanGiliran = qS('.urutanGiliran')
    let urutanTeks = `Urutan Giliran`
    for(let i in playersTurn) 
        urutanTeks += `\n#${+i + 1} - ${playersTurn[i]}`
    urutanGiliran.innerText = urutanTeks
    // disable tombolMulai after clicked
    qS('.tombolMulai').disabled = false
    qS('.tombolMulai').onclick = () => {
        qS('.tombolMulai').disabled = true
        let tempGiliran = null
        for(let p in playersTurn) {
            if(playersTurn[p] == getLocStorage('username'))
                tempGiliran = +p
        }
        const jsonData = {
            username: getLocStorage('username'),
            harta: +mods[1],
            pos: 1,
            kartu: '',
            giliran: tempGiliran,
            penjara: false
        }
        fetcher(`${url}/api/ready`, 'post', jsonData)
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

function gettingReady(readyPlayers) {
    // waiting other player to get ready
    const urutanGiliran = qS('.urutanGiliran')
    let readyCounter = 0
    readyPlayers.forEach(v => {
        if(v.player_ready === true)
            readyCounter += 1
    })
    let urutanTeks = `Urutan Giliran`
    for(let i in playersTurn) 
        urutanTeks += `\n#${+i + 1} - ${playersTurn[i]}`
    urutanGiliran.innerText = `${urutanTeks}\n${readyCounter} player sudah siap..`
    if(playersTurn.length == readyCounter) {
        let timer = 4
        startInterval = setInterval(() => {
            urutanGiliran.innerText = `game dimulai dalam . . ${timer}`
            timer--
            if(timer == -1) {
                clearInterval(startInterval)
                urutanGiliran.innerText = ``
                // run this function after the timer is out 
                // to trigger the first move because the getLocStorage('username') considered null
                kocokDaduTrigger()
            }
        }, 1000);
    }
}

function allPlayersLastPos() {
    
}

function kocokDaduTrigger() {
    if(getLocStorage('username') != null) {
        // get shape element for each player
        thisShapeIsMe()
        // check whose turn is it now and enable the kocok dadu button
        if(playersTurn[giliranCounter] == getLocStorage('username')) {
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

function thisShapeIsMe() {
    for(let player of qSA('.pdiv')) {
        if(player.id == playersTurn[giliranCounter]) 
            myShape = player
    }
}

function playerMoves() {
    // start moving player
    qS('.acakDadu').onclick = () => {
        // ### add tempMoveChance later for bercabangDua map ###
        // my pos right now
        const myPosNow = +myShape.parentElement.classList[0].match(/\d+/)
        // dice animation
        const daduAnimasi = null
        // roll the dice
        // const playerDadu = customDadu || Math.floor(Math.random() * 6) + 1
        const playerDadu = Math.floor(Math.random() * 6) + 1
        // my pos after roll dice
        const playerMove = (myPosNow + playerDadu) % 28 == 0 ? 28 : ((myPosNow + playerDadu) % 28)
        // steps counter
        let steps = 0, stepsCounter = 0
        // display dice roll number
        qS('.acakDaduTeks').innerText = `Angka Dadu: ${playerDadu}`
        // start moving the player
        // ### try moving the player with realtime, so other player can see the movements ###
        startInterval = setInterval(() => { playerMoving() }, 500)
        function playerMoving() {
            // stepsCounter + 1 because 
            steps = myPosNow + (stepsCounter + 1)
            for(let land of qSA('[class^=petak]')) {
                if(land.title == (steps % 28 == 0 ? 28 : steps % 28))
                    land.appendChild(myShape)
            }
            stepsCounter++
            if(stepsCounter == playerDadu) {
                console.log('moving done');
                clearInterval(startInterval)
            }
        }
        // player turn end
        const jsonData = {
            username: getLocStorage('username'),
            harta: 0,
            pos: 0,
            kartu: '',
            giliran: 0,
            penjara: false
        }
        // fetcher(`${url}/api/endturn`, 'post', jsonData)
    }
}