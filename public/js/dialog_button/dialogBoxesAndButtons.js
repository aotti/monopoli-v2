// the buttons in the game title
function interactWithButtons(mods, gameStatus = null) {
    // players dialog
    qS('#cekPlayer').onclick = ()=>{
        if(qS('.dialog_info')) return
        const papanGame = qS('#papan_game')
        // create wrapper and dialog container
        const dialogWrapper = cE('div')
        const dialogInfo = cE('div')
        dialogWrapper.classList.add('dialog_wrapper')
        dialogInfo.classList.add('dialog_info')
        // append wrapper and dialog container
        dialogWrapper.appendChild(dialogInfo)
        papanGame.appendChild(dialogWrapper)
        // create title dialog
        const titleModsDiv = cE('div')
        const titleModsSpan = cE('h3')
        appendGameDialogBoxesOrButtonsToBoard(
            false, true,
            ['div', 'div', 'span'],
            [dialogInfo, titleModsDiv, titleModsSpan],
            [null, 'class', 'none'],
            [null, 'dialogTitle', null],
            [null, null, 'Player Ingfo']
        )
        // div max player
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'maxPlayer',
            cE('span'), cE('span'),
            'Max Player', '5 Player'
        )
        // div joined player
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'joinedPlayer',
            cE('span'), cE('span'),
            'Joined Player', (playersTurn.length > 0 ? playersTurn.join(', ') : '~')
        )
        // div bentuk player
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'bentukPlayer',
            cE('span'), cE('span'),
            'Bentuk Player', `Player 1 = O - Player 2 = \u{25A2} - Player 3 = \u{25B3} - Player 4 = \u{25C7} - Player 5 = pokoknya tabung`
        )
        // create close button
        const closePlayerDiv = cE('div')
        const closePlayerButton = cE('input')
        appendGameDialogBoxesOrButtonsToBoard(
            false, true,
            ['div', 'div', 'button'],
            [dialogInfo, closePlayerDiv, closePlayerButton],
            [null, 'class', 'id'],
            [null, 'closePlayer', 'closePlayerButton'],
            [null, null, 'Tutup']
        )
        // close dialog
        closePlayerButton.onclick = () => {
            removeDialog(dialogWrapper, dialogInfo)
        }
    }
    // mods dialog
    qS('#cekMods').onclick = ()=>{
        if(qS('.dialog_info')) return
        const papanGame = qS('#papan_game')
        // create wrapper and dialog container
        const dialogWrapper = cE('div')
        const dialogInfo = cE('div')
        dialogWrapper.classList.add('dialog_wrapper')
        dialogInfo.classList.add('dialog_info')
        // append wrapper and dialog container
        dialogWrapper.appendChild(dialogInfo)
        papanGame.appendChild(dialogWrapper)
        // create title dialog
        const titleModsDiv = cE('div')
        const titleModsSpan = cE('h3')
        appendGameDialogBoxesOrButtonsToBoard(
            false, true,
            ['div', 'div', 'span'],
            [dialogInfo, titleModsDiv, titleModsSpan],
            [null, 'class', 'none'],
            [null, 'dialogTitle', null],
            [null, null, 'Mods Ingfo']
        )
        // div bentuk papan
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'bentukPapan',
            cE('span'), cE('span'),
            'Bentuk Papan', mods[0].board_shape
        )
        // div uang start
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'uangStart',
            cE('span'), cE('span'),
            'Uang Start', `Rp ${currencyComma(mods[0].money_start)}`
        )
        // div uang kalah
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'uangKalah',
            cE('span'), cE('span'),
            'Uang Kalah', `- Rp ${currencyComma(mods[0].money_lose)}`
        )
        // div rand kutukan
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'randKutukan',
            cE('span'), cE('span'),
            'Rand Kutukan', `${mods[0].curse_min} ~ ${mods[0].curse_max}%`
        )
        // div cabang
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'cabang',
            cE('span'), cE('span'),
            'Cabang', `${mods[0].branch}%`
        )
        // create close button
        const closeModsDiv = cE('div')
        const closeModsButton = cE('input')
        appendGameDialogBoxesOrButtonsToBoard(
            false, true,
            ['div', 'div', 'button'],
            [dialogInfo, closeModsDiv, closeModsButton],
            [null, 'class', 'id'],
            [null, 'closeMods', 'closeModsButton'],
            [null, null, 'Tutup']
        )
        // close dialog
        closeModsButton.onclick = () => {
            removeDialog(dialogWrapper, dialogInfo)
        }
    }
    // profil dialog
    qS('#cekProfil').onclick = ()=>{
        if(qS('.dialog_info')) return
        const papanGame = qS('#papan_game')
        // create wrapper and dialog container
        const dialogWrapper = cE('div')
        const dialogInfo = cE('div')
        dialogWrapper.classList.add('dialog_wrapper')
        dialogInfo.classList.add('dialog_info')
        // append wrapper and dialog container
        dialogWrapper.appendChild(dialogInfo)
        papanGame.appendChild(dialogWrapper)
        const titleProfilDiv = cE('div')
        const titleProfilSpan = cE('h3')
        appendGameDialogBoxesOrButtonsToBoard(
            false, true,
            ['div', 'div', 'span'],
            [dialogInfo, titleProfilDiv, titleProfilSpan],
            [null, 'class', 'none'],
            [null, 'dialogTitle', null],
            [null, null, 'Profil']
        )
        // div uuid
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'uuid',
            cE('span'), cE('span'),
            'UUID', myGameData.uuid == null ? 'none' : myGameData.uuid
        )
        // div username
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'username',
            cE('span'), cE('span'),
            'Username', myGameData.username == null ? 'none' : myGameData.username
        )
        // create close and logout button
        const profilButtonsDiv = cE('div')
        const closeProfilButton = cE('input')
        const logoutProfilButton = cE('input')
        logoutProfilButton.disabled = myGameData.uuid == null ? true : false
        appendGameDialogBoxesOrButtonsToBoard(
            false, true,
            ['div', 'div', 'button', 'button'],
            [dialogInfo, profilButtonsDiv, logoutProfilButton, closeProfilButton],
            [null, 'class', 'id', 'id'],
            [null, 'closeProfil', 'logoutProfilButton', 'closeProfilButton'],
            [null, null, 'Logout', 'Tutup']
        )
        // close dialog
        closeProfilButton.onclick = () => {
            removeDialog(dialogWrapper, dialogInfo)
        }
        // logout account
        qS('#logoutProfilButton').onclick = (ev) => {
            if(getLocStorage('uuid') == null) {
                removeDialog(dialogWrapper, dialogInfo)
                return errorNotification('anda belum login')
            }
            // ### HANYA BISA LOGOUT JIKA SUDAH SURRENDER / GAME STATUS != PLAYING
            ev.target.disabled = true
            playerLogout()
        }
    }
    // register & login dialog
    for(let reglog of qSA('.register, .login')) {
        reglog.onclick = (ev)=>{
            if(qS('.dialog_info') || getLocStorage('uuid')) return
            const papanGame = qS('#papan_game')
            // create wrapper and dialog container
            const dialogWrapper = cE('div')
            const dialogInfo = cE('div')
            dialogWrapper.classList.add('dialog_wrapper')
            dialogInfo.classList.add('dialog_info')
            // append wrapper and dialog container
            dialogWrapper.appendChild(dialogInfo)
            papanGame.appendChild(dialogWrapper)
            // title
            const titleRegLogDiv = cE('div')
            const titleRegLogSpan = cE('h3')
            // username input
            const usernameRegLogDiv = cE('div')
            const usernameRegLogSpan = cE('span')
            const usernameRegLog = cE('input')
            usernameRegLog.maxLength = 10
            // password input
            const passwordRegLogDiv = cE('div')
            const passwordRegLogSpan = cE('span')
            const passwordRegLog = cE('input')
            // confirm password input
            const confirmPassRegLogDiv = cE('div')
            const confirmPassRegLogSpan = cE('span')
            const confirmPassRegLog = cE('input')
            // register & login button
            const registerLoginDiv = cE('div')
            const registerLoginButton = cE('input')
            // close reglog dialog
            const closeRegLogButton = cE('input')
            // register dialog
            if(ev.target.classList[0] == 'register') {
                // register title
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span'],
                    [dialogInfo, titleRegLogDiv, titleRegLogSpan],
                    [null, 'class', 'none'],
                    [null, 'dialogTitle', null],
                    [null, null, 'Register']
                )
                // username input
                usernameRegLog.placeholder = 'username 4 ~ 10 huruf'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'text'],
                    [dialogInfo, usernameRegLogDiv, usernameRegLogSpan, usernameRegLog],
                    [null, 'class', 'class', 'id'],
                    [null, 'usernameRegDiv', 'usernameRegSpan', 'usernameReg'],
                    [null, null, 'Username', null]
                )
                // password input
                passwordRegLog.placeholder = 'password min. 4 huruf'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'password'],
                    [dialogInfo, passwordRegLogDiv, passwordRegLogSpan, passwordRegLog],
                    [null, 'class', 'class', 'id'],
                    [null, 'passwordRegDiv', 'passwordRegSpan', 'passwordReg'],
                    [null, null, 'Password', null]
                )
                // confirm password input
                confirmPassRegLog.placeholder = 'yg bener ya buntang'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'password'],
                    [dialogInfo, confirmPassRegLogDiv, confirmPassRegLogSpan, confirmPassRegLog],
                    [null, 'class', 'class', 'id'],
                    [null, 'confirmPassRegDiv', 'confirmPassRegSpan', 'confirmPasswordReg'],
                    [null, null, 'Confirm Pass', null]
                )
                // register button
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'button', 'button'],
                    [dialogInfo, registerLoginDiv, registerLoginButton, closeRegLogButton],
                    [null, 'class', 'id', 'id'],
                    [null, 'registerRegDiv', 'register', 'closeRegLogButton'],
                    [null, null, 'Register', 'Tutup']
                )
            }
            // login dialog
            else if(ev.target.classList[0] == 'login') {
                // login title
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span'],
                    [dialogInfo, titleRegLogDiv, titleRegLogSpan],
                    [null, 'class', 'none'],
                    [null, 'dialogTitle', null],
                    [null, null, 'Login']
                )
                // username input
                usernameRegLog.placeholder = 'pake akun sendiri, yung'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'text'],
                    [dialogInfo, usernameRegLogDiv, usernameRegLogSpan, usernameRegLog],
                    [null, 'class', 'class', 'id'],
                    [null, 'usernameLogDiv', 'usernameLogSpan', 'usernameLog'],
                    [null, null, 'Username', null]
                )
                // password input
                passwordRegLog.placeholder = 'klk amb hekel'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'password'],
                    [dialogInfo, passwordRegLogDiv, passwordRegLogSpan, passwordRegLog],
                    [null, 'class', 'class', 'id'],
                    [null, 'passwordLogDiv', 'passwordLogSpan', 'passwordLog'],
                    [null, null, 'Password', null]
                )
                // login button
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'button', 'button'],
                    [dialogInfo, registerLoginDiv, registerLoginButton, closeRegLogButton],
                    [null, 'class', 'id', 'id'],
                    [null, 'registerLoginDiv', 'login', 'closeRegLogButton'],
                    [null, null, 'Login', 'Tutup']
                )
            }
            // close dialog
            closeRegLogButton.onclick = () => {
                removeDialog(dialogWrapper, dialogInfo)
            }
            // prevent register dialog not exists error
            if(qS('#register')) {
                // when user register
                qS('#register').onclick = (ev)=>{
                    ev.target.disabled = true
                    playerRegisterOrLogin('register', ev.target)
                } 
            }
            // prevent login dialog not exists error
            else if(qS('#login')) {
                // when user login
                qS('#login').onclick = (ev)=>{
                    ev.target.disabled = true
                    playerRegisterOrLogin('login', ev.target)
                }
            }
        }
    }

    if(gameStatus == 'playing') {
        // setting button
        qS('.setting_button').onclick = ()=>{
            if(qS('.setting_menu').style.display == 'none' || qS('.setting_menu').style.display == '') {
                qS('.setting_menu').style.display = 'block';
                qS('.setting_arrow').style.display = 'block';
            }
            else {
                qS('.myCityBox').style.display = 'none';
                qS('.setting_menu').style.display = 'none';
                qS('.setting_arrow').style.display = 'none';
                while(qS('.myCityBox').firstChild && qS('.myCityBox').firstChild.classList != null && qS('.myCityBox').firstChild.classList[0] != 'myCityButton')
                    qS('.myCityBox').removeChild(qS('.myCityBox').firstChild);
            }
        }
        // cards hover
        for(let cardHover of qSA('.kartuBuffDebuff')) {
            cardHover.onmouseover = (ev)=>{
                if(!ev.target.classList.toString().match(/kartuBuffDebuff/)) return
                if(ev.target.classList.toString().match(/kartuBuffDebuffList/)) return
                ev.target.firstChild.style.display = 'block'
            }
            cardHover.onmouseout = (ev)=>{
                if(!ev.target.classList.toString().match(/kartuBuffDebuff/)) return
                if(ev.target.classList.toString().match(/kartuBuffDebuffList/)) return
                ev.target.firstChild.style.display = 'none'
            }
        }
    }
    else {
        window.onclick = (ev)=>{
            // check when you click on setting button
            const areYouPlaying = playersTurn.map(v => {return v}).indexOf(myGameData.username)
            // if not playing then button wont work
            if(ev.target.classList == 'setting_button' && areYouPlaying == -1) {
                errorNotification('Anda sedang tidak main')
                return feedbackTurnOff()
            }
        }
    }

    qS('#clearStorage').onclick = ()=>{
        localStorage.clear()
    }
}

// 3d dice
function dadu3D(divGame, divCont, divDice) {
    for(let i=0; i<6; i++) {
      let diceSide = cE('div')
      for(let j=0; j<6; j++) {
        let diceDot = cE('div')
        if(i == 0 && j < 1) {
          diceSide.id = 'dice-one-side-one';
          diceSide.classList.add('side', 'one');
          diceDot.classList.add(`dot`, `one-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 1 && j < 2) {
          diceSide.id = 'dice-one-side-two';
          diceSide.classList.add('side', 'two');
          diceDot.classList.add(`dot`, `two-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 2 && j < 3) {
          diceSide.id = 'dice-one-side-three';
          diceSide.classList.add('side', 'three');
          diceDot.classList.add(`dot`, `three-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 3 && j < 4) {
          diceSide.id = 'dice-one-side-four';
          diceSide.classList.add('side', 'four');
          diceDot.classList.add(`dot`, `four-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 4 && j < 5) {
          diceSide.id = 'dice-one-side-five';
          diceSide.classList.add('side', 'five');
          diceDot.classList.add(`dot`, `five-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
        else if(i == 5 && j < 6) {
          diceSide.id = 'dice-one-side-six';
          diceSide.classList.add('side', 'six');
          diceDot.classList.add(`dot`, `six-${j + 1}`);
          diceSide.appendChild(diceDot);
        }
      }
      docFrag.appendChild(diceSide);
      diceSide = null;
    }
    divDice.id = 'dice1';
    divDice.classList.add('dice', 'dice-one');
    divCont.classList.add('container');
    divGame.classList.add('game');
    divDice.appendChild(docFrag);
    divCont.appendChild(divDice);
    divGame.appendChild(divCont);
    return divGame;
}

/**
 * @param {Boolean} allowAppendToBoard - the container will append to board, put 'false' if you dont need (boolean)
 * @param {Boolean} secondContainer - second container existence (boolean)
 * @param {Array<string>} elTypes - element types: div/span/button/text/pass (array)
 * @param {Array<HTMLElement>} elements - html elements (array)
 * @param {Array<string>} attrTypes - attribute types: class/id/text/none (array)
 * @param {Array<string>} attrs - attribute values (array)
 * @param {Array<string>} textValues - html text (array)
 */
function appendGameDialogBoxesOrButtonsToBoard(allowAppendToBoard, secondContainer, elTypes, elements, attrTypes, attrs, textValues) {
    const papanGame = qS('#papan_game')
    // run gameDialogBoxesAndButtons
    gameDialogBoxesAndButtons(secondContainer, elTypes, elements, attrTypes, attrs, textValues)
    // append dialog to  papangame
    if(allowAppendToBoard)
        papanGame.appendChild(elements[0])
}

function insertAttributeAndValue(element, attrType, attr, textValue) {
    switch(attrType) {
        case 'class':
            element.classList.add(attr)
            element.innerText = textValue
            element.value = textValue
            break
        case 'id':
            element.id = attr
            element.innerText = textValue
            element.value = textValue
            break
        case 'none':
            element.innerText = textValue
            element.value = textValue
            break
        case null:
            break
    }
}

function gameDialogBoxesAndButtons(secondContainer, elTypes, elements, attrTypes, attrs, textValues) {
    for(let i in elements) {
        // check attrTypes
        switch(elTypes[i]) {
            case 'div':
                // insert attributes and content
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'span':
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'button':
                elements[i].type = 'button'
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'text':
                elements[i].type = 'text'
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
            case 'password':
                elements[i].type = 'password'
                insertAttributeAndValue(elements[i], attrTypes[i], attrs[i], textValues[i])
                break
        }
        // append elements to 2nd container
        // elements[1] must be container
        if(secondContainer && i > 1) {
            elements[1].appendChild(elements[i])
        }
        // append elements to container
        // elements[0] must be container
        else if(i > 0) {
            elements[0].appendChild(elements[i])
        }
    }
}

function dialogBoxSpanChild(mainDialog, container, classContainer, spanTitle, spanValue, textTitle, textValue) {
    appendGameDialogBoxesOrButtonsToBoard(
        false, true,
        ['div', 'div', 'span', 'span'],
        [mainDialog, container, spanTitle, spanValue],
        [null, 'class', 'none', 'none'],
        [null, classContainer, null, null],
        [null, null, textTitle, textValue]
    )
}
