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
            setLocStorage('username', userName.value)
            acakGiliranButton.disabled = true;
            userName.style.boxShadow = '';
            userName.disabled = true;
            const randNumber = Math.floor(Math.random() * (10001 - 1000)) + 1000;
            acakGiliranTeks.innerText = `Angka: ${randNumber}`
            const jsonData = { randNumber: randNumber, username: userName.value }
            fetcher(`${url}/api/prepare`, 'post', jsonData)
            .then(data => data.json())
            .then(result => {
                // if response status != 200, then display it to the screen
                if(result.status != 200) {
                    if(typeof result.errorMessage === 'object') {
                        return errorCapsule(err, `an error occured\n`)
                    }
                    // error when player using the same username
                    if(result.errorMessage.message?.match(/duplicate.key.value/)) {
                        errorNotification(`username sudah dipakai\n`)
                        acakGiliranButton.disabled = false;
                        userName.disabled = false;
                        return
                    }
                    else if(result.errorMessage.match(/cannot.be.null/)) {
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
                                playerTurns.push(otherPlayers[adjustPlayerTurn].player_joined)
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
                    playerTurns.push(otherPlayers[adjustPlayerTurn].player_joined)
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
    if(playerTurns.length == 0) return
    createPlayerShape(cE('div'), 'pdiv', playerTurns[0], cE('img'), 'img/bulet.png', 'stick1')
    createPlayerShape(cE('div'), 'pdiv', playerTurns[1], cE('img'), 'img/kotak.png', 'stick2')
    playerTurns[2] == null ? null : createPlayerShape(cE('div'), 'pdiv', playerTurns[2], cE('img'), 'img/segitiga.png', 'stick3')
    playerTurns[3] == null ? null : createPlayerShape(cE('div'), 'pdiv', playerTurns[3], cE('img'), 'img/diamond.png', 'stick4')
    playerTurns[4] == null ? null : createPlayerShape(cE('div'), 'pdiv', playerTurns[4], cE('img'), 'img/tabung.png', 'stick5')
    // set up the game
    const urutanGiliran = qS('.urutanGiliran')
    let urutanTeks = `Urutan Giliran`
    for(let i in playerTurns) 
        urutanTeks += `\n#${+i + 1} - ${playerTurns[i]}`
    urutanGiliran.innerText = urutanTeks
    // disable tombolMulai after clicked
    let tombolMulaiDisable = false
    qS('.tombolMulai').disabled = false
    qS('.tombolMulai').onclick = () => {
        qS('.tombolMulai').disabled = true
        const jsonData = {
            username: getLocStorage('username'),
            harta: +mods[1],
            pos: 1,
            kartu: null
        }
        fetcher(`${url}/api/ready`, 'post', jsonData)
        .then(data => data.json())
        .then(result => {
            if(result.status != 200) {
                return errorCapsule(err, `an error occured\n`)
            }
        })
        .catch(err => {
            return errorCapsule(err, `an error occured\n`)
        })
    }
}

function gettingReady(readyPlayers) {
    // waiting other player to get ready
    // console.log(readyPlayers);
    const urutanGiliran = qS('.urutanGiliran')
    let readyCounter = 0
    readyPlayers.forEach(v => {
        if(v.player_ready === true)
            readyCounter += 1
    })
    let urutanTeks = `Urutan Giliran`
    for(let i in playerTurns) 
        urutanTeks += `\n#${+i + 1} - ${playerTurns[i]}`
    urutanGiliran.innerText = `${urutanTeks}\n${readyCounter} player sudah siap..`
    if(playerTurns.length == readyCounter) {
        let timer = 4
        startInterval = setInterval(() => {
            urutanGiliran.innerText = `game dimulai dalam . . ${timer}`
            timer--
            if(timer == -1) {
                clearInterval(startInterval)
                qS('.acakDadu').disabled = false
            }
        }, 1000);
    }
}

function playerMoves() {
    // start moving player
    qS('.acakDadu').onclick = () => {
        console.log('player moving');
    }
}