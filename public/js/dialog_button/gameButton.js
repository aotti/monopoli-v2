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
        [null, `Putaran #`, emoji.coffee]
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
            'Player In-game', (playersTurn.length > 0 ? playersTurn.join('\n') : 'game belum dimulai')
        )
        // div bentuk player
        dialogBoxSpanChild(
            dialogInfo,
            cE('div'), 'bentukPlayer',
            cE('span'), cE('span'),
            'Bentuk Player', `Player 1 = O - Player 2 = ${emoji.rectangle} - Player 3 = ${emoji.triangle} - Player 4 = ${emoji.diamond} - Player 5 = pokoknya tabung`
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
    // profil dialog and logout button
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
            // check if player is already logged in
            if(getLocStorage('uuid') == null) {
                removeDialog(dialogWrapper, dialogInfo)
                errorNotification('Anda belum login')
                return feedbackTurnOff()
            }
            // check if player is not surrender/lose yet
            const findSurrender = playersTurnObj.map(v => {return v.username}).indexOf(myGameData.username)
            // player exist
            if(findSurrender > -1) {
                const surrendMoney = playersTurnObj[findSurrender].harta_uang
                // if the player money still doesnt meet req for surrend/lose
                if(surrendMoney > -mods[0].money_lose) {
                    removeDialog(dialogWrapper, dialogInfo)
                    errorNotification('Klik [udahan dulu lah] di setting kalo mau logout')
                    return feedbackTurnOff()
                }
            }
            // when meet all reqs, player will be able to logout
            ev.target.disabled = true
            playerLogout()
        }
    }
    // admin settings
    if(qS('#adminSetting')) {
        qS('#adminSetting').onclick = ()=>{
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
            // admin elements
            // admin title
            const titleModsDiv = cE('div')
            const titleModsSpan = cE('h3')
            appendGameDialogBoxesOrButtonsToBoard(
                false, true,
                ['div', 'div', 'span'],
                [dialogInfo, titleModsDiv, titleModsSpan],
                [null, 'class', 'none'],
                [null, 'dialogTitle', null],
                [null, null, 'Admin Setting']
            )
            // change mods button
            const editModsSpan = cE('div')
            const editModsTeks = cE('span')
            const editModsButton = cE('input')
            appendGameDialogBoxesOrButtonsToBoard(
                // 2nd container
                false, true, 
                // element types
                ['div', 'div', 'span', 'button'],
                // elements (1st element must be a container, 2nd optional)
                [dialogInfo, editModsSpan, editModsTeks, editModsButton],
                // attribute types
                [null, 'class', 'class', 'class'],
                // attribute values
                [null, 'editModsSpan', 'editModsTeks', 'editModsButton'],
                // innerText
                [null, null, 'Edit Mods', 'Edit']
            )
            // reset game status button
            const gameStatusSpan = cE('div')
            const gameStatusTeks = cE('span')
            const gameStatusButton = cE('input')
            appendGameDialogBoxesOrButtonsToBoard(
                // 2nd container
                false, true, 
                // element types
                ['div', 'div', 'span', 'button'],
                // elements (1st element must be a container, 2nd optional)
                [dialogInfo, gameStatusSpan, gameStatusTeks, gameStatusButton],
                // attribute types
                [null, 'class', 'class', 'class'],
                // attribute values
                [null, 'gameStatusSpan', 'gameStatusTeks', 'gameStatusButton'],
                // innerText
                [null, null, 'Game Status', 'Reset to unready']
            )
            // reset table player data
            const playerTableSpan = cE('div')
            const playerTableTeks = cE('span')
            const playerTableButton = cE('input')
            appendGameDialogBoxesOrButtonsToBoard(
                // 2nd container
                false, true, 
                // element types
                ['div', 'div', 'span', 'button'],
                // elements (1st element must be a container, 2nd optional)
                [dialogInfo, playerTableSpan, playerTableTeks, playerTableButton],
                // attribute types
                [null, 'class', 'class', 'class'],
                // attribute values
                [null, 'playerTableSpan', 'playerTableTeks', 'playerTableButton'],
                // innerText
                [null, null, 'Player Table', 'Reset the table']
            )
            // setting status
            const settingStatusSpan = cE('div')
            const settingStatusTeks = cE('span')
            const settingStatusInput = cE('input')
            settingStatusInput.readOnly = true
            appendGameDialogBoxesOrButtonsToBoard(
                // 2nd container
                false, true, 
                // element types
                ['div', 'div', 'span', 'text'],
                // elements (1st element must be a container, 2nd optional)
                [dialogInfo, settingStatusSpan, settingStatusTeks, settingStatusInput],
                // attribute types
                [null, 'class', 'class', 'class'],
                // attribute values
                [null, 'settingStatusSpan', 'settingStatusTeks', 'settingStatusInput'],
                // innerText
                [null, null, 'Setting Status', 'none']
            )
            // create close button
            const closeAdminDiv = cE('div')
            const closeAdminButton = cE('input')
            appendGameDialogBoxesOrButtonsToBoard(
                false, true,
                ['div', 'div', 'button'],
                [dialogInfo, closeAdminDiv, closeAdminButton],
                [null, 'class', 'id'],
                [null, 'closeAdmin', 'closeAdminButton'],
                [null, null, 'Tutup']
            )
            // close dialog
            closeAdminButton.onclick = () => {
                removeDialog(dialogWrapper, dialogInfo)
            }
            // edit mods button
            editModsButton.onclick = () => {
                dialogInfo.style.left = '20%'
                const getEditModsElements = editModsElements(dialogWrapper)
                // board type
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    getEditModsElements.boardType.elementTypes,
                    getEditModsElements.boardType.elements,
                    getEditModsElements.boardType.attrTypes,
                    getEditModsElements.boardType.attrs,
                    getEditModsElements.boardType.textValues
                )
                // money start
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    getEditModsElements.moneyStart.elementTypes,
                    getEditModsElements.moneyStart.elements,
                    getEditModsElements.moneyStart.attrTypes,
                    getEditModsElements.moneyStart.attrs,
                    getEditModsElements.moneyStart.textValues
                )
                // money lose
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    getEditModsElements.moneyLose.elementTypes,
                    getEditModsElements.moneyLose.elements,
                    getEditModsElements.moneyLose.attrTypes,
                    getEditModsElements.moneyLose.attrs,
                    getEditModsElements.moneyLose.textValues
                )
                // curse min
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    getEditModsElements.curseMin.elementTypes,
                    getEditModsElements.curseMin.elements,
                    getEditModsElements.curseMin.attrTypes,
                    getEditModsElements.curseMin.attrs,
                    getEditModsElements.curseMin.textValues
                )
                // curse max
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    getEditModsElements.curseMax.elementTypes,
                    getEditModsElements.curseMax.elements,
                    getEditModsElements.curseMax.attrTypes,
                    getEditModsElements.curseMax.attrs,
                    getEditModsElements.curseMax.textValues
                )
                // save button
                appendGameDialogBoxesOrButtonsToBoard(
                    false, true,
                    getEditModsElements.saveMods.elementTypes,
                    getEditModsElements.saveMods.elements,
                    getEditModsElements.saveMods.attrTypes,
                    getEditModsElements.saveMods.attrs,
                    getEditModsElements.saveMods.textValues
                )
                qS('#saveModsButton').onclick = () => {
                    const modsChanges = [
                        qS('.editModsBoardEl').value,
                        qS('.editModsMoneyStartEl').value,
                        qS('.editModsMoneyLoseEl').value,
                        qS('.editModsCurseMinEl').value,
                        qS('.editModsCurseMaxEl').value
                    ]
                    const modsConfirm = `
                        Board Type    > ${modsChanges[0]}
                        Money Start  > Rp ${currencyComma(modsChanges[1])}
                        Money Lose  > Rp -${currencyComma(modsChanges[2])}
                        Curse Range > ${modsChanges[3]} ~ ${modsChanges[4]}%
    
                        Are you sure?
                    `
                    const jsonData = {
                        username: myGameData.username,
                        boardShape: modsChanges[0],
                        moneyStart: modsChanges[1],
                        moneyLose: modsChanges[2],
                        curseMin: modsChanges[3],
                        curseMax: modsChanges[4]
                    }
                    if(confirm(modsConfirm)) {
                        settingStatusInput.style.background = 'lightblue'
                        settingStatusInput.value = 'loading..'
                        fetcher('/mods', 'PATCH', jsonData)
                        .then(result => {
                            if(result.status !==  200) {
                                settingStatusInput.style.background = 'coral'
                                return settingStatusInput.value = 'you are not admin'
                            }
                            settingStatusInput.style.background = 'limegreen'
                            settingStatusInput.value = 'edit mods success'
                            return fetcherResults(result)
                        })
                        .catch(err => {
                            return errorCapsule(err, anErrorOccured)
                        })
                    }
                }
            }
            // reset game status function
            gameStatusButton.onclick = () => {
                if(gameStatus === null || gameStatus === 'unready') {
                    settingStatusInput.style.background = 'coral'
                    return settingStatusInput.value = 'unable to reset status'
                }
                settingStatusInput.style.background = 'lightblue'
                settingStatusInput.value = 'loading..'
                // reset function
                resetter.resetGameStatus(settingStatusInput, myGameData.username)
                const startInterval = setInterval(() => {
                    if(qS('#gameStatus').style.background === 'lightgrey') {
                        clearInterval(startInterval)
                        settingStatusInput.style.background = 'limegreen'
                        return settingStatusInput.value = 'reset status success'
                    }
                }, 1000);
            }
            // reset player table function
            playerTableButton.onclick = () => {
                settingStatusInput.style.background = 'lightblue'
                settingStatusInput.value = 'loading..'
                // reset function
                return resetter.resetPlayerTable(settingStatusInput, myGameData.username)
            }
        }
    }
    // register & login dialog
    for(let reglog of qSA('.register, .login')) {
        reglog.onclick = (ev)=>{
            // if getLocStorage('uuid') exist, that mean the player is alr logged in
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
                // auto focus on username input
                usernameRegLog.focus()
                // press ENTER key event listener
                dialogInfo.addEventListener('keydown', (ev) => {
                    if(ev.which === 13) {
                        registerLoginButton.click()
                    }
                })
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
                // auto focus on username input
                usernameRegLog.focus()
                // press ENTER key event listener
                dialogInfo.addEventListener('keydown', (ev) => {
                    if(ev.which === 13) {
                        registerLoginButton.click()
                    }
                })
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
            // display menu item
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
        // menu items
        const menuItems = {
            awtoKocokDadu: qS('#awtoKocokDadu')
        }
        // - awto kocok dadu
        if(getLocStorage('awtoKocokDadu') && getLocStorage('awtoKocokDadu') === 'true') {
            // set input to check if localStorage 'awtoKocokDadu' exists
            menuItems.awtoKocokDadu.checked = true
        }
        // -- set awto kocok dadu on/off
        menuItems.awtoKocokDadu.onclick = (ev)=>{
            // set on
            if(ev.target.checked) 
                setLocStorage('awtoKocokDadu', true)
            // set off
            else
                setLocStorage('awtoKocokDadu', false)
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
}

function editModsElements(dialogWrapper) {
    function rangeInputAttr(input, min, max, step) {
        input.type = 'range'
        input.min = min
        input.max = max
        input.step = step
    }
    const editModsDialog = cE('div')
    editModsDialog.classList.add('editModsDialog')
    dialogWrapper.appendChild(editModsDialog)
    // board
    const editModsBoardSpan = cE('h4')
    const editModsBoardEl = (()=>{
        const comboBox = cE('select')
        const optionValues = ['persegiPanjangV1', 'persegiPanjangV2', 'anggapSegitiga', 'bercabangDua']
        for(let val of optionValues) {
            const option = cE('option')
            option.value = val
            option.innerText = val
            comboBox.appendChild(option)
        }
        return comboBox
    })()
    // money start
    const editModsMoneyStartSpan = cE('h4')
    const editModsMoneyStartEl = cE('input')
    rangeInputAttr(editModsMoneyStartEl, 25000, 125000, 25000)
    // money lose
    const editModsMoneyLoseSpan = cE('h4')
    const editModsMoneyLoseEl = cE('input')
    rangeInputAttr(editModsMoneyLoseEl, 25000, 75000, 25000)
    // curse min
    const editModsCurseMinSpan = cE('h4')
    const editModsCurseMinEl = cE('input')
    rangeInputAttr(editModsCurseMinEl, 10, 20, 2.5)
    // curse max
    const editModsCurseMaxSpan = cE('h4')
    const editModsCurseMaxEl = cE('input')
    rangeInputAttr(editModsCurseMaxEl, 20, 30, 2.5) 
    // save mods
    const saveModsDiv = cE('div')
    const saveModsButton = cE('input')
    // required edit mods element, class & value
    // ### BELUM ADA TOMBOL SAVE UNTUK UBAH MODS
    const editModsObj = {
        // board type
        boardType: {
            elementTypes: ['div', 'span', 'combox'],
            elements: [editModsDialog, editModsBoardSpan, editModsBoardEl],
            attrTypes: [null, 'none', 'class-only'],
            attrs: [null, null, 'editModsBoardEl'],
            textValues: [null, 'Board Type', null]
        },
        // money start
        moneyStart: {
            elementTypes: ['div', 'span', 'range'],
            elements: [editModsDialog, editModsMoneyStartSpan, editModsMoneyStartEl],
            attrTypes: [null, 'none', 'class'],
            attrs: [null, null, 'editModsMoneyStartEl'],
            textValues: [null, 'Money Start', null]
        },
        // money lose
        moneyLose: {
            elementTypes: ['div', 'span', 'range'],
            elements: [editModsDialog, editModsMoneyLoseSpan, editModsMoneyLoseEl],
            attrTypes: [null, 'none', 'class'],
            attrs: [null, null, 'editModsMoneyLoseEl'],
            textValues: [null, 'Money Lose', null]
        },
        // curse min
        curseMin: {
            elementTypes: ['div', 'span', 'range'],
            elements: [editModsDialog, editModsCurseMinSpan, editModsCurseMinEl],
            attrTypes: [null, 'none', 'class'],
            attrs: [null, null, 'editModsCurseMinEl'],
            textValues: [null, 'Curse Min', null]
        },
        // curse max
        curseMax: {
            elementTypes: ['div', 'span', 'range'],
            elements: [editModsDialog, editModsCurseMaxSpan, editModsCurseMaxEl],
            attrTypes: [null, 'none', 'class'],
            attrs: [null, null, 'editModsCurseMaxEl'],
            textValues: [null, 'Curse Max', null]
        },
        // curse max
        saveMods: {
            elementTypes: ['div', 'div', 'button'],
            elements: [editModsDialog, saveModsDiv, saveModsButton],
            attrTypes: [null, 'class', 'id'],
            attrs: [null, 'saveMods', 'saveModsButton'],
            textValues: [null, null, 'Save']
        }
    }
    return editModsObj
}