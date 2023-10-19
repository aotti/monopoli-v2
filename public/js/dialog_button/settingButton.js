function settingButton(mods) {
    // setting button
    qS('.setting_button').onclick = ()=>{
        // display menu item
        if(qS('.setting_menu').style.display == 'none' || qS('.setting_menu').style.display == '') {
            qS('.setting_menu').style.display = 'block';
            qS('.setting_arrow').style.display = 'block';
        }
        // hide menu item
        else {
            qS('.setting_menu').style.display = 'none';
            qS('.setting_arrow').style.display = 'none';
        }
    }
    // menu items
    const menuItems = {
        awtoKocokDadu: qS('#awtoKocokDadu'),
        daftarKota: qS('.myCityList'),
        udahanDulu: qS('.leaveGame')
    }
    // -awto kocok dadu
    if(getLocStorage('awtoKocokDadu') && getLocStorage('awtoKocokDadu') === 'true') {
        // set input to check if localStorage 'awtoKocokDadu' exists
        menuItems.awtoKocokDadu.checked = true
    }
    // -udahan dulu
    menuItems.udahanDulu.onclick = (ev)=>{
        // ### HARUS PASANG KONDISI BELUM GILIRAN DISINI
        // ### HARUS PASANG KONDISI BELUM GILIRAN DISINI
        // hide setting menu
        qS('.setting_menu').style.display = 'none';
        qS('.setting_arrow').style.display = 'none';
        // payload
        const jsonData = {
            user_id: myGameData.id,
            harta_uang: -999_999,
            harta_kota: '',
            kartu: ''
        }
        // run surrender api
        fetcher('/surrender', 'PATCH', jsonData)
        .then(result => {
            if(result.data.errorMessage) {
                feedbackTurnOn(result.data.errorMessage)
                feedbackTurnOff()
            }
            return fetcherResults(result)
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
    }
    // --set awto kocok dadu on/off
    menuItems.awtoKocokDadu.onclick = (ev)=>{
        // set on
        if(ev.target.checked) 
            setLocStorage('awtoKocokDadu', true)
        // set off
        else
            setLocStorage('awtoKocokDadu', false)
    }
    // -daftar kota saia
    menuItems.daftarKota.onclick = (ev)=>{
        if(qS('.dialog_info')) return
        // hide setting menu
        qS('.setting_menu').style.display = 'none';
        qS('.setting_arrow').style.display = 'none';
        const papanGame = qS('#papan_game')
        // create wrapper and dialog container
        const dialogWrapper = cE('div')
        const dialogInfo = cE('div')
        const dialogInfoSide = cE('div')
        dialogWrapper.classList.add('dialog_wrapper')
        dialogInfo.classList.add('dialog_info')
        dialogInfoSide.classList.add('dialog_info_side')
        // append wrapper and dialog container
        dialogWrapper.appendChild(dialogInfo)
        dialogWrapper.appendChild(dialogInfoSide)
        papanGame.appendChild(dialogWrapper)
        // city list box
        // title
        dialogBoxTitle(dialogInfo, 'Daftar Kota')
        // city list
        const closeCityListDiv = cE('div')
        const closeCityListButton = cE('input')
        fetcher('/citiesandcards', 'GET')
        .then(result => {
            fetcherResults(result)
            // data from database
            const { hartaUang, hartaKota, kartu, jalan, putaran, sell_city } = {
                hartaUang: result.data.harta_uang,
                hartaKota: result.data.harta_kota.split(';'),
                kartu: result.data.kartu,
                jalan: result.data.jalan,
                putaran: result.data.putaran,
                sell_city: result.data.sell_city
            }
            // get all cities prices
            const cityListGiliran = playersTurn.indexOf(myGameData.username)
            const getAllCityPrices = playerCityList(cityListGiliran)
            // save city name and price in this array for sell city onclick event 
            const citiesAndPrices = []
            // append all cities and buttons to the dialog
            for(let i in hartaKota) {
                // city name
                const cityName = hartaKota[i].split('-')[0]
                // if player has no city (empty string)
                if(cityName == '') {
                    // noCitySpan element
                    const noCitySpan = cE('h3')
                    noCitySpan.style.border = '2px solid orangered'
                    noCitySpan.style.color = 'darkblue'
                    // append noCitySpan to dialog
                    appendGameDialogBoxesOrButtonsToBoard(
                        false, true,
                        ['div', 'div', 'span'],
                        [dialogInfo, cE('div'), noCitySpan],
                        [null, 'class', 'none'],
                        [null, 'dialogTitle', null],
                        [null, null, 'Anda belum punya kota']
                    )
                }
                // if player has any city
                else {
                    // city price
                    const cityPrice = +getAllCityPrices[i].classList[0].split('_')[3]
                    // fill citiesAndPrices for sell city event
                    citiesAndPrices.push({city: cityName, price: cityPrice})
                    // append city to dialog
                    dialogBoxSpanChild(
                        dialogInfo,
                        cE('div'), 'cityNameItem',
                        cE('span'), cE('span'),
                        `Kota ${cityNameFirstLetter(cityName)}`, `Rp ${currencyComma(cityPrice)}`
                    )
                }
            }
            // select city combo box
            const selectCityListDiv = cE('div')
            const selectCityListTeks = cE('span')
            const selectCityListEl = (()=>{
                const comboBox = cE('select')
                const optionValues = hartaKota
                for(let val of optionValues) {
                    const option = cE('option')
                    // val.split to get only city name 
                    // ex: 'jakarta-tanah,1rumah' -> ['jakarta', 'tanah,1rumah']
                    option.value = val.split('-')[0]
                    option.innerText = val.split('-')[0]
                    comboBox.appendChild(option)
                }
                return comboBox
            })()
            appendGameDialogBoxesOrButtonsToBoard(
                false, true,
                ['div', 'div', 'span', 'button'],
                [dialogInfo, selectCityListDiv, selectCityListTeks, selectCityListEl],
                [null, 'class', 'class', 'class-only'],
                [null, 'selectCityList', 'selectCityListTeks', 'selectCityListEl'],
                [null, null, 'Jual kota', null]
            )
            // upgrade, jual button
            const miscCityListDiv = cE('div')
            const upgradeCityListButton = cE('input')
            const sellCityListButton = cE('input')
            // sell city guide
            const sellCityGuide = `1. Pada baris "Jual kota", ada box untuk memilih kota\n2. Lalu klik "Jual" untuk menjual kota tersebut\n3. Hanya bisa jual 1 kota per putaran ${emoji.pray}`
            // set guide to data-info
            sellCityListButton.setAttribute('data-info', sellCityGuide)
            // find upgrade kota card
            const upgradeKota = kartu.match(/upgrade-kota/)
            // upgrade kota requirements
            const upgradeKotaReqs = {
                jalan: jalan ? `Giliran Anda: ${emoji.check}` : `Giliran Anda: ${emoji.cross}`,
                hartaKota: hartaKota != '' ? `Punya kota: ${emoji.check}` : `Punya kota: ${emoji.cross}`,
                kartu: upgradeKota ? `Kartu upgrade: ${emoji.check}` : `Kartu upgrade: ${emoji.cross}`,
                putaran: putaran >= 2 ? `Putaran > 1: ${emoji.check}` : `Putaran > 1: ${emoji.cross}`
            }
            // set reqs to data-info
            upgradeCityListButton.setAttribute('data-info', `Semua syarat harus [${emoji.check}]\n${upgradeKotaReqs.jalan}\n${upgradeKotaReqs.hartaKota}\n${upgradeKotaReqs.kartu}\n${upgradeKotaReqs.putaran}`)
            appendGameDialogBoxesOrButtonsToBoard(
                false, true,
                ['div', 'div', 'button', 'button'],
                [dialogInfo, miscCityListDiv, upgradeCityListButton, sellCityListButton],
                [null, 'class', 'id', 'id'],
                [null, 'miscCityList', 'upgradeCityListButton', 'sellCityListButton'],
                [null, null, 'Upgrade', 'Jual']
            )
            // close button
            closeCityListButton.style.marginTop = '5px'
            appendGameDialogBoxesOrButtonsToBoard(
                false, true,
                ['div', 'div', 'button'],
                [dialogInfo, closeCityListDiv, closeCityListButton],
                [null, 'class', 'id'],
                [null, 'closeCityList', 'closeCityListButton'],
                [null, null, 'Tutup']
            )
            // close dialog
            closeCityListButton.onclick = () => {
                removeDialog(dialogWrapper, dialogInfo)
            }
            // sell city event
            sellCityListButton.onclick = () => {
                if(sell_city) {
                    removeDialog(dialogWrapper, dialogInfo)
                    feedbackTurnOn('Anda sudah menjual kota pada putaran ini')
                    return feedbackTurnOff()
                }
                // do nothing if combo box empty
                if(selectCityListEl.value == '') return 
                // get city price
                const findCityPrice = citiesAndPrices.map(v => v.city).indexOf(selectCityListEl.value)
                const sellCityPrice = citiesAndPrices[findCityPrice].price
                // popup confirm alert 
                const sellCityTeks = `Apakah anda yakin ingin menjual kota ${selectCityListEl.value}\ndengan harga Rp ${currencyComma(sellCityPrice)}?`
                if(confirm(sellCityTeks)) {
                    const jsonData = {
                        user_id: myGameData.id,
                        money_after_sale: hartaUang + sellCityPrice,
                        city_for_sale: selectCityListEl.value,
                        cities_after_sale: manageCities(selectCityListEl.value, null, 'sell'),
                        sell_city: true
                    }
                    fetcher('/sellcity', 'PATCH', jsonData)
                    .then(result => {
                        oneTimeStatus.sellCity = true
                        return fetcherResults(result)
                    })
                    .catch(err => {
                        return errorCapsule(err, anErrorOccured)
                    })
                    removeDialog(dialogWrapper, dialogInfo)
                }
            }
            // upgrade city event
            if(jalan && hartaKota != '' && upgradeKota && putaran >= 2) {
                upgradeCityListButton.onclick = () => {
                    if(confirm('Kota yang akan diupgrade dipilih secara acak\nApakah anda tetap ingin upgrade?')) {
                        removeDialog(dialogWrapper, dialogInfo)
                        // get player shape
                        const tempPlayersTurnShape = thisShapeIsMe(myGameData.username)
                        // get player current position
                        const tempPlayerDiceMove = +tempPlayersTurnShape.parentElement.classList[0].match(/\d+/)
                        // get player giliran
                        const tempGiliran = playersTurn.indexOf(myGameData.username)
                        // get random city for upgrade
                        const cityForUpgrade = getRandomCity(tempGiliran, 'buy')
                        // required data to buy city 
                        // only to prevent error but not used because outerEvent.endturn = false
                        const tempRequiredLandEventData = {
                            mods: mods,
                            giliran: tempGiliran,
                            playersTurnShape: tempPlayersTurnShape,
                            playerDiceMove: tempPlayerDiceMove,
                            playerLaps: putaran,
                            endTurnMoney: hartaUang,
                            playerCities: hartaKota.join(';'),
                            playerCards: manageCards('upgrade-kota', true)
                        }
                        // trigger land event from upgrade kota card
                        const outerEvent = {
                            cond: 'stepOnCity',
                            data: {
                                type: 'buyCity',
                                endturn: false,
                                elements: cityForUpgrade
                            }
                        }
                        return landEventHandler(tempRequiredLandEventData, null, outerEvent)
                    }
                }
            }
            // sell and upgrade tooltip
            for(let button of [sellCityListButton, upgradeCityListButton]) {
                button.onmouseover = (ev) => {
                    dialogInfoSide.style.display = 'block'
                    dialogInfoSide.innerText = ev.target.dataset.info
                }
                button.onmouseout = (ev) => {
                    dialogInfoSide.style.display = 'none'
                }
            }
            return
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
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