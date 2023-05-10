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
            fetch(`${url}/api/prepare`, {
                method: 'post',
                body: JSON.stringify({
                    randNumber: randNumber,
                    username: userName.value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
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

function createPlayers() {

}

function playerMoves() {

}