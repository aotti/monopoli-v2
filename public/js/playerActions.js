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
    switch(otherPlayers.length) {
        case 1:
            // waiting more players 
            urutanGiliran.innerText = `${otherPlayers.length} player(s) waiting..`
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
                createPlayers(otherPlayers)
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

function createPlayers(otherPlayers) {
    createPlayerShape(cE('div'), 'pdiv', otherPlayers[0].player_joined, cE('img'), 'img/bulet.png', 'stick1')
    createPlayerShape(cE('div'), 'pdiv', otherPlayers[1].player_joined, cE('img'), 'img/kotak.png', 'stick2')
    otherPlayers[2] == null ? null : createPlayerShape(cE('div'), 'pdiv', otherPlayers[2].player_joined, cE('img'), 'img/segitiga.png', 'stick3')
    otherPlayers[3] == null ? null : createPlayerShape(cE('div'), 'pdiv', otherPlayers[3].player_joined, cE('img'), 'img/diamond.png', 'stick4')
    otherPlayers[4] == null ? null : createPlayerShape(cE('div'), 'pdiv', otherPlayers[4].player_joined, cE('img'), 'img/tabung.png', 'stick5')
}

function playerMoves() {

}