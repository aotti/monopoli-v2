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
                // if response status != 200, then display it to the screen
                if(result.status != 200) {
                    qS('.feedback_box').style.opacity = 1;
                    qS('.feedback_box').children[0].innerText = "an error occured\n";
                    return console.log(result);
                }
            })
            .catch(err => console.log(err))
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

function waitingOtherPlayers(otherPlayers) {
    const urutanGiliran = qS('.urutanGiliran')
    let tempPlayerTurns = []
    for(let v of otherPlayers)
        tempPlayerTurns.push(v.player_rand)
    switch(otherPlayers.length) {
        case 1:
            // waiting more players 
            urutanGiliran.innerText = `${otherPlayers.length} player waiting..`
            break
        case 2: case 3: case 4:
            let forceCounter = 0
            let paksaMulaiDisable = false
            otherPlayers.forEach((v, i, arr) => {
                if(v.player_forcing == true) {
                    forceCounter += 1
                    if(v.player_joined == qS('.userName').value)
                        paksaMulaiDisable = true
                }
            })
            urutanGiliran.innerText = `${otherPlayers.length} player waiting..\n${forceCounter} player memaksa..`
            // paksa mulai button enabled
            qS('.paksaMulai').disabled = paksaMulaiDisable
            qS('.paksaMulai').onclick = (ev) => {
                ev.target.disabled = true
                const theOtherPlayer = otherPlayers.map(v => {return v.player_joined}).indexOf(qS('.userName').value)
                forceStartGame(otherPlayers[theOtherPlayer])
            }
            // prepare the game
            if(otherPlayers.length == forceCounter) {
                tempPlayerTurns.sort().reverse()
                for(let v of tempPlayerTurns) {
                    const adjustPlayerTurn = otherPlayers.map(v => {return v.player_rand}).indexOf(v)
                    if(adjustPlayerTurn != -1)
                        playerTurns.push(otherPlayers[adjustPlayerTurn].player_joined)
                }
                createPlayersAndGetReady(otherPlayers)
            }
            break
        case 5:
            // prepare the game
            break
    }
}

function forceStartGame(theOtherPlayer) {
    fetcher(`${url}/api/forcestart`, 'post', {username: theOtherPlayer.player_joined})
    .then(data => data.json())
    .then(result => {
        if(result.status != 200) {
            qS('.feedback_box').style.opacity = 1;
            qS('.feedback_box').children[0].innerText = "an error occured\n";
            return console.log(result);
        }
    })
    .catch(err => console.log(err))
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
    let tombolMulaiDisable = false
    qS('.tombolMulai').disabled = tombolMulaiDisable
}

function playerMoves() {

}