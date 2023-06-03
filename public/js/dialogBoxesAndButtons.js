// confirm dialog when player step on land to  
// buy house || get cards || going to jail  || free parking
function confirmDialog() {
    // create dialog box
    const dialogConfirmBox = cE('div')
    const textBox = cE('div')
    const buttonAgree = cE('input')
    const buttonDisagree = cE('input')
    const textBoxInnerText = 'Apakah anda mau beli tanah di kota Jakarta dengan harga Rp 50.000, atau langsung beli rumah dengan harga Rp 100.000?'
    // create and append dialog
    appendGameDialogBoxesOrButtonsToBoard(
        // allow append to board, 2nd container
        true, false, 
        // element types
        ['div', 'div', 'button', 'button'],
        // elements (the first element must be a container)
        [dialogConfirmBox, textBox, buttonAgree, buttonDisagree],
        // attribute types
        ['class', 'none', 'id', 'id'],
        // attribute values
        ['confirm_box', null, 'buyAgree', 'buyDisagree'],
        // innerText
        [null, textBoxInnerText, 'Beli', 'Males']
    )
}

// the buttons in the middle of board
function gameButtons() {
    // container
    const infoArea = cE('div')
    infoArea.classList.add('infoArea')
    // register & login
    const registerSpan = cE('span')
    const registerButton = cE('input')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span', 'button'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, registerSpan, registerButton],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'registerSpan', 'register'],
        // innerText
        [null, null, 'Register']
    )
    const loginSpan = cE('span')
    const loginButton = cE('input')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span', 'button'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, loginSpan, loginButton],
        // attribute types
        [null, 'class', 'class', 'class', 'class'],
        // attribute values
        [null, 'loginSpan', 'login'],
        // innerText
        [null, null, 'Login']
    )
    // putaran 
    const putaranTeks = cE('span')
    const putaranBuff = cE('span')
    putaranBuff.dataset.buff = `[Bonus Uang Kalo Lewat Start] putaran > 6 = uang +40% putaran > 14 = uang +80%`;
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span', 'span'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, putaranTeks, putaranBuff],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'putaranTeks', 'putaranBuff'],
        // innerText
        [null, `Putaran ${laps}`, '\u{2615}']
    )
    // paksa start
    const paksaMulaiSpan = cE('span')
    const paksaMulaiButton = cE('input')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span', 'button'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, paksaMulaiSpan, paksaMulaiButton],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'paksaMulaiSpan', 'paksaMulai'],
        // innerText
        [null, null, 'Paksa Mulai']
    )
    paksaMulaiButton.disabled = true
    // username
    const userNameSpan = cE('span')
    const userName = cE('input')
    userName.disabled = true
    userName.readOnly = true
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span', 'text'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, userNameSpan, userName],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'userNameSpan', 'userName'],
        // innerText
        [null, null, null]
    )
    userName.placeholder = 'Username';
    userName.maxLength = '8';
    // mulai button
    const tombolMulaiSpan = cE('span')
    const tombolMulaiButton = cE('input')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span', 'button'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, tombolMulaiSpan, tombolMulaiButton],
        // attribute types
        [null, 'class', 'class'],
        // attribute values
        [null, 'tombolMulaiSpan', 'tombolMulai'],
        // innerText
        [null, null, 'Mulai']
    )
    tombolMulaiButton.disabled = true
    // acak dadu
    const acakDaduSpan = cE('span')
    const acakDaduButton = cE('input')
    const acakDaduTeks = cE('div')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span', 'button', 'div', 'div'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, acakDaduSpan, acakDaduButton, acakDaduTeks, dadu3D(cE('div'), cE('div'), cE('div'))],
        // attribute types
        [null, 'class', 'class', 'class', null],
        // attribute values
        [null, 'acakDaduSpan', 'acakDadu', 'acakDaduTeks', null],
        // innerText
        [null, null, 'Kocok Dadu', null, null]
    )
    acakDaduButton.disabled = true
    // acak giliran
    const acakGiliranSpan = cE('span')
    const acakGiliranButton = cE('input')
    const acakGiliranTeks = cE('div')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span', 'button', 'div'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, acakGiliranSpan, acakGiliranButton, acakGiliranTeks],
        // attribute types
        [null, 'class', 'class', 'class'],
        // attribute values
        [null, 'acakGiliranSpan', 'acakGiliran', 'acakGiliranTeks'],
        // innerText
        [null, null, 'Kocok Giliran', null]
    )
    // info giliran
    const urutanGiliran = cE('span')
    appendGameDialogBoxesOrButtonsToBoard(
        // 2nd container
        true, true, 
        // element types
        ['div', 'span'],
        // elements (1st element must be a container, 2nd optional)
        [infoArea, urutanGiliran],
        // attribute types
        [null, 'class'],
        // attribute values
        [null, 'urutanGiliran'],
        // innerText
        [null, 'urutan']
    )
}

// the buttons in the game title
function infoButtons() {
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
            dialogInfo.remove()
            dialogWrapper.style.display = 'none'
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
            'Bentuk Papan', mods[0]
        )
        // div uang start
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'uangStart',
            cE('span'), cE('span'),
            'Uang Start', `Rp ${currencyComma(mods[1])}`
        )
        // div uang kalah
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'uangKalah',
            cE('span'), cE('span'),
            'Uang Kalah', `- Rp ${currencyComma(mods[2])}`
        )
        // div rand kutukan
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'randKutukan',
            cE('span'), cE('span'),
            'Rand Kutukan', `${mods[3]} ~ ${mods[4]}%`
        )
        // div cabang
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'cabang',
            cE('span'), cE('span'),
            'Cabang', `${mods[5]}%`
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
            dialogInfo.remove()
            dialogWrapper.style.display = 'none'
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
            'UUID', 'uuid.split(-)[2]'
        )
        // div username
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'username',
            cE('span'), cE('span'),
            'Username', 'none'
        )
        // create close and logout button
        const profilButtonsDiv = cE('div')
        const closeProfilButton = cE('input')
        const logoutProfilButton = cE('input')
        logoutProfilButton.disabled = true
        appendGameDialogBoxesOrButtonsToBoard(
            false, true,
            ['div', 'div', 'button', 'button'],
            [dialogInfo, profilButtonsDiv, closeProfilButton, logoutProfilButton],
            [null, 'class', 'id', 'id'],
            [null, 'closeProfil', 'closeProfilButton', 'logoutProfilButton'],
            [null, null, 'Tutup', 'Logout']
        )
        // close dialog
        closeProfilButton.onclick = () => {
            dialogInfo.remove()
            dialogWrapper.style.display = 'none'
        }
        // logout account
        if(1 == 2) {
            qS('#logoutProfilButton').onclick = () => {
                console.log('logout success');
            }
        }
    }
    // register & login dialog
    for(let reglog of qSA('.register, .login')) {
        reglog.onclick = (ev)=>{
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
            // title
            const titleRegLogDiv = cE('div')
            const titleRegLogSpan = cE('h3')
            // username input
            const usernameRegLogDiv = cE('div')
            const usernameRegLogSpan = cE('span')
            const usernameRegLog = cE('input')
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
                usernameRegLog.placeholder = 'username 4 ~ 8 huruf'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'text'],
                    [dialogInfo, usernameRegLogDiv, usernameRegLogSpan, usernameRegLog],
                    [null, 'class', 'none', 'id'],
                    [null, 'usernameRegDiv', null, 'usernameReg'],
                    [null, null, 'Username', null]
                )
                // password input
                passwordRegLog.placeholder = 'amb hekel klk h3h3'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'password'],
                    [dialogInfo, passwordRegLogDiv, passwordRegLogSpan, passwordRegLog],
                    [null, 'class', 'none', 'id'],
                    [null, 'passwordRegDiv', null, 'passwordReg'],
                    [null, null, 'Password', null]
                )
                // confirm password input
                confirmPassRegLog.placeholder = 'yg bener ya buntang'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'password'],
                    [dialogInfo, confirmPassRegLogDiv, confirmPassRegLogSpan, confirmPassRegLog],
                    [null, 'class', 'none', 'id'],
                    [null, 'confirmPassRegDiv', null, 'confirmPasswordReg'],
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
                    [null, 'class', 'none', 'id'],
                    [null, 'usernameLogDiv', null, 'usernameLog'],
                    [null, null, 'Username', null]
                )
                // password input
                passwordRegLog.placeholder = 'password anda'
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    ['div', 'div', 'span', 'password'],
                    [dialogInfo, passwordRegLogDiv, passwordRegLogSpan, passwordRegLog],
                    [null, 'class', 'none', 'id'],
                    [null, 'passwordLogDiv', null, 'passwordLog'],
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
                dialogInfo.remove()
                dialogWrapper.style.display = 'none'
            }
        }
    }
    qS('#clearStorage').onclick = ()=>{
        localStorage.clear('username')
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
 * @param {Array<HTMLElement>} elements - html elements (array)
 * @param {Array<string>} elTypes - element types: div/span/button/text/pass (array)
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
