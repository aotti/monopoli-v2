function cardsEvent(mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney, data) {
    if(data.cardType == 'kartu_danaUmum') {
        return danaUmumCards('Dana Umum', mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney)
    }
    else if(data.cardType == 'kartu_kesempatan') {
        return kesempatanCards('Kesempatan', mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney)
    }
}

function danaUmumCards(cardEventType, mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney) {
    qS('#pDanaUmum').play();
    return preparingCards(cardEventType, mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney)
}

function kesempatanCards(cardEventType, mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney) {
    qS('#pKesempatan').play();
    return preparingCards(cardEventType, mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney)
}

function preparingCards(cardEventType, mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney) {
    // random number to pick cards
    const chances = Math.random() * 100
    // pick cards and put into container
    const cardList = choosingCard(cardEventType, chances, giliran, endTurnMoney)
    // pick a card
    const cardPickIndex = Math.floor(Math.random() * cardList.cards.length)
    const cardPick = cardList.cards[cardPickIndex]
    const cardType = cardList.types[cardPickIndex]
    const cardEffect = cardList.effects[cardPickIndex]
    // check card type then activate the effect
    const cardText = `[${cardEventType}]\n${cardPick}`
    const cardsObject = {
        cardEventType: cardEventType,
        mods: mods,
        giliran: giliran,
        playersTurnShape: playersTurnShape,
        tempPlayerPosNow: tempPlayerPosNow,
        endTurnMoney: endTurnMoney,
        cardType: cardType,
        cardEffect: cardEffect,
        cardText: cardText
    }
    return checkAndActivateCard(cardsObject)
}

function checkAndActivateCard(cardsObject) {
    // retrieve data
    const { mods, giliran, playersTurnShape, tempPlayerPosNow, endTurnMoney, cardType, cardEffect, cardText } = cardsObject
    const cardsEventData = {}
    const splitEffect = (()=>{
        if(typeof cardEffect === 'number') return cardEffect 
        else if(typeof cardEffect === 'string') return cardEffect.split('-')
        else if(Array.isArray(cardEffect)) return cardEffect
    })()
    // check card type
    switch(cardType) {
        case 'gainMoney':
            cardsEventData.moneyLeft = endTurnMoney + cardEffect
            // if no changes on city, just make it null
            cardsEventData.cities = null
            // create card dialog
            confirmDialog(cardText)
            return cardsEventData
        case 'loseMoney':
            cardsEventData.moneyLeft = endTurnMoney - cardEffect
            // if no changes on city, just make it null
            cardsEventData.cities = null
            // create card dialog
            confirmDialog(cardText)
            return cardsEventData
        case 'buyCity':
            if(splitEffect.length === 1) {
                cardsEventData.moneyLeft = endTurnMoney
                // if no changes on city, just make it null
                cardsEventData.cities = null
                // create card dialog
                confirmDialog(`${cardText}\n---\n${splitEffect[0]}`)
                return cardsEventData
            }
            else if(splitEffect.length === 2) {
                confirmDialog(`${cardText}\n---\nloading..`)
                // run buy city dialog after 3 secs
                setTimeout(() => {
                    const tempRequiredLandEventData = {
                        mods: mods,
                        giliran: giliran,
                        playersTurnShape: playersTurnShape,
                        playerDiceMove: tempPlayerPosNow,
                        playerLaps: +qS('.putaranTeks').innerText.match(/\d+/),
                        endTurnMoney: endTurnMoney,
                        playerCities: playersTurnObj[giliran].harta_kota
                    }
                    // trigger land event from 
                    const outerEvent = {
                        cond: 'stepOnCity',
                        data: {
                            type: 'buyCity',
                            elements: splitEffect
                        }
                    }
                    landEventHandler(tempRequiredLandEventData, null, outerEvent)
                }, 3000);
            }
            break
        case 'sellCity':
            // dont have any city
            if(splitEffect.length === 1) {
                cardsEventData.moneyLeft = endTurnMoney
                // if no changes on city, just make it null
                cardsEventData.cities = null
                // create card dialog
                confirmDialog(`${cardText}\n---\n${splitEffect[0]}`)
            }
            // have atleast 1 city
            else if(splitEffect.length === 2) {
                cardsEventData.moneyLeft = endTurnMoney + +splitEffect[1]
                // if no changes on city, just make it null
                cardsEventData.cities = manageCities(splitEffect[0], null, 'sell')
                // create card dialog
                confirmDialog(`${cardText}\n---\nKota ${splitEffect[0]} terjual ${emoji.catShock}`)
            }
            return cardsEventData
        case 'moveForward':
            // player select the forward number
            if(splitEffect[0] === 'manual') {
                const allLands = qSA('[class^=kota], [class*=special]')
                // array for cities number (land number)
                const citiesArray = []
                for(let land of allLands) {
                    // find player city based on username
                    if(land.classList[0].includes(myGameData.username)) {
                        citiesArray.push(land.parentElement.title)}
                }
                // parking button and number
                const citiesButtons = createButtonsOrTextValue('button', false, citiesArray)
                const { types, buttons, attributes, classes, text } = {
                    types: fillTheElementsForDialog('button', citiesArray.length),
                    buttons: fillTheElementsForDialog(citiesButtons, null, true),
                    attributes: fillTheElementsForDialog('class', citiesArray.length),
                    classes: fillTheElementsForDialog('parkingButtons', citiesArray.length),
                    text: fillTheElementsForDialog(citiesArray, null, true)
                }
                // create parking dialog
                confirmDialog(cardText, types, buttons, attributes, classes, text)
                // set confirm box top position
                qS('.confirm_box').style.top = '40%'
                // if the player doesnt have any city
                if(citiesArray.length === 0) {
                    qS('.confirm_box').firstChild.innerText += `\n---\nAnda belum punya kota ${emoji.joy}`
                    cardsEventData.moneyLeft = endTurnMoney
                    // if no changes on city, just make it null
                    cardsEventData.cities = null
                    return cardsEventData
                }
                // if the card needs player interaction
                for(let button of qSA('.parkingButtons')) {
                    button.onclick = (ev) => {
                        const destinationPos = +ev.target.value
                        const customDadu = (destinationPos > tempPlayerPosNow 
                                        ? destinationPos - tempPlayerPosNow 
                                        : (destinationPos + 28) - tempPlayerPosNow)
                        // add confirm_box text
                        setTimeout(() => {
                            qS('.confirm_box').firstChild.innerText += `\n---\nMenuju ke petak ${destinationPos}`
                        }, 1000);
                        // trigger the kocok dadu button
                        kocokDaduTrigger(mods, giliran, customDadu)
                        qS('.acakDadu').disabled = false
                        return qS('.acakDadu').click()
                    }
                }
            }
            // determined forward number
            else if(splitEffect[0] === 'auto') {
                // filter the effect
                switch(splitEffect[1]) {
                    // going to jail and pay 90% fine
                    case 'penjara90%':
                        // create card dialog
                        confirmDialog(cardText)
                        // set confirm box top position
                        qS('.confirm_box').style.top = '40%'
                        // set fine
                        const fineAmount = endTurnMoney * .90
                        setLocStorage('fineAmount', fineAmount)
                        // set destination and playerDadu 
                        const penjaraPos = 10
                        const customDaduPenjara = (penjaraPos > tempPlayerPosNow 
                                        ? penjaraPos - tempPlayerPosNow 
                                        : (penjaraPos + 28) - tempPlayerPosNow)
                        // trigger the kocok dadu button
                        kocokDaduTrigger(mods, giliran, customDaduPenjara)
                        qS('.acakDadu').disabled = false
                        qS('.acakDadu').click()
                        break
                    case 'aduNasib':
                        const freeOrJail = Math.random() * 100
                        // create parking dialog
                        confirmDialog(cardText)
                        // set confirm box top position
                        qS('.confirm_box').style.top = '40%'
                        // free parking
                        if(freeOrJail < 51) {
                            // start moving 
                            gambleFreeOrJail(24, tempPlayerPosNow, mods, giliran)
                        }
                        // prison
                        else if(freeOrJail >= 51 && freeOrJail < 100) {
                            // set fine
                            const fineAmount = endTurnMoney * .90
                            setLocStorage('fineAmount', fineAmount)
                            // start moving 
                            gambleFreeOrJail(10, tempPlayerPosNow, mods, giliran)
                        }
                        break
                    case 'kotaOrangLain':
                        const allLands = qSA('[class^=kota], [class*=special]')
                        // array for cities number (land number)
                        const citiesArray = []
                        for(let land of allLands) {
                            // find player city based on username
                            if(land.classList[0].split('_')[4] && !land.classList[0].includes(myGameData.username)) {
                                citiesArray.push(land.parentElement.title)}
                        }
                        // parking button and number
                        const citiesButtons = createButtonsOrTextValue('button', false, citiesArray)
                        const { types, buttons, attributes, classes, text } = {
                            types: fillTheElementsForDialog('button', citiesArray.length),
                            buttons: fillTheElementsForDialog(citiesButtons, null, true),
                            attributes: fillTheElementsForDialog('class', citiesArray.length),
                            classes: fillTheElementsForDialog('parkingButtons', citiesArray.length),
                            text: fillTheElementsForDialog(citiesArray, null, true)
                        }
                        // create parking dialog
                        confirmDialog(cardText, types, buttons, attributes, classes, text)
                        // set confirm box top position
                        qS('.confirm_box').style.top = '40%'
                        // if the player doesnt have any city
                        if(citiesArray.length === 0) {
                            qS('.confirm_box').firstChild.innerText += `\n---\nPlayer lain masih misqueen ${emoji.joy}`
                            cardsEventData.moneyLeft = endTurnMoney
                            // if no changes on city, just make it null
                            cardsEventData.cities = null
                            return cardsEventData
                        }
                        const autoClick = Math.floor(Math.random() * citiesArray.length)
                        // click random city
                        qSA('.parkingButtons')[autoClick].onclick = (ev) => {
                            const destinationPos = +ev.target.value
                            const customDadu = (destinationPos > tempPlayerPosNow 
                                            ? destinationPos - tempPlayerPosNow 
                                            : (destinationPos + 28) - tempPlayerPosNow)
                            // add confirm_box text
                            setTimeout(() => {
                                qS('.confirm_box').firstChild.innerText += `\n---\nMenuju ke petak ${destinationPos}`
                            }, 1000);
                            // trigger the kocok dadu button
                            kocokDaduTrigger(mods, giliran, customDadu)
                            qS('.acakDadu').disabled = false
                            return qS('.acakDadu').click()
                        }
                        qSA('.parkingButtons')[autoClick].click()
                        for(let button of qSA('.parkingButtons'))
                            button.disabled = true
                        break
                    case 'oneStep':
                        // set playerDadu 
                        const customDadu = 1
                        // trigger the kocok dadu button
                        kocokDaduTrigger(mods, giliran, customDadu)
                        qS('.acakDadu').disabled = false
                        qS('.acakDadu').click()
                        break
                }
            }
            return
        case 'moveBackward':
            // create card dialog
            confirmDialog(cardText)
            // set confirm box top position
            qS('.confirm_box').style.top = '40%'
            // start moving 
            const customDadu = cardEffect
            // trigger the kocok dadu button
            kocokDaduTrigger(mods, giliran, customDadu)
            qS('.acakDadu').disabled = false
            return qS('.acakDadu').click()
        case 'specialCard':
            cardsEventData.moneyLeft = endTurnMoney
            // if no changes on city, just make it null
            cardsEventData.cities = null
            cardsEventData.cards = manageCards(cardEffect)
            // create card dialog
            confirmDialog(cardText)
            return cardsEventData
        case 'miniGame':
            new Promise((resolve, reject) => {
                if(splitEffect[0] === 'choose_a_coin') {
                    const coinArray = [1,2,3]
                    // shuffle the coins
                    shuffle(coinArray)
                    // create coins
                    const coinButtons = createButtonsOrTextValue('button', false, coinArray)
                    const coinClasses = createButtonsOrTextValue('class', false, coinArray, 'koin_')
                    const { types, buttons, attributes, classes, text } = {
                        types: fillTheElementsForDialog('button', coinArray.length),
                        buttons: fillTheElementsForDialog(coinButtons, null, true),
                        attributes: fillTheElementsForDialog('class', coinArray.length),
                        classes: fillTheElementsForDialog(coinClasses, null, true),
                        text: fillTheElementsForDialog('???', coinArray.length)
                    }
                    // create coin dialog
                    confirmDialog(cardText, types, buttons, attributes, classes, text)
                    // select a coin
                    for(let button of qSA('[class^=koin]')) {
                        button.onclick = (ev) => {
                            const choosenCoin = +ev.target.classList[0].match(/\d/)
                            ev.target.value = choosenCoin
                            cardsEventData.moneyLeft = endTurnMoney + (20_000 * choosenCoin)
                            // if no changes on city, just make it null
                            cardsEventData.cities = null
                            return resolve(cardsEventData)
                        }
                    }
                }
                else if(splitEffect[0] === 'move_or_draw') {
                    const selectMove = cE('input')
                    const selectDraw = cE('input')
                    // required elements for confirm dialog
                    const { types, buttons, attributes, classes, text } = {
                        types: fillTheElementsForDialog('button', 2),
                        buttons: fillTheElementsForDialog([selectMove, selectDraw], null, true),
                        attributes: fillTheElementsForDialog('class', 2),
                        classes: fillTheElementsForDialog(['selectMove', 'selectDraw'], null, true),
                        text: fillTheElementsForDialog(['Maju sampai Start', 'Ambil Kartu'], null, true)
                    }
                    // create choice button dialog
                    confirmDialog(cardText, types, buttons, attributes, classes, text)
                    for(let button of qSA('.selectMove, .selectDraw')) {
                        // select a button
                        button.onclick = (ev) => {
                            // move to start
                            if(ev.target.classList[0] === 'selectMove') {
                                // replace the text without buttons
                                qS('.confirm_box').innerText = `\n${cardText}\n---\nMenuju ke start..`
                                // start moving 
                                const destinationPos = 1
                                const customDadu = (destinationPos > tempPlayerPosNow 
                                                ? destinationPos - tempPlayerPosNow 
                                                : (destinationPos + 28) - tempPlayerPosNow)
                                // trigger the kocok dadu button
                                kocokDaduTrigger(mods, giliran, customDadu)
                                qS('.acakDadu').disabled = false
                                return qS('.acakDadu').click()
                            }
                            // draw a card
                            else if(ev.target.classList[0] === 'selectDraw') {
                                // replace the text without buttons
                                qS('.confirm_box').innerText = `\n${cardText}\n---\nMengambil kartu..`
                                setTimeout(() => {
                                    const tempRequiredLandEventData = {
                                        mods: mods,
                                        giliran: giliran,
                                        playersTurnShape: playersTurnShape,
                                        playerDiceMove: tempPlayerPosNow,
                                        playerLaps: +qS('.putaranTeks').innerText.match(/\d+/),
                                        endTurnMoney: endTurnMoney,
                                        playerCities: playersTurnObj[giliran].harta_kota
                                    }
                                    // trigger land event from 
                                    const outerEvent = {
                                        cond: 'drawCard',
                                        data: {
                                            type: 'kartu_danaUmum',
                                            elements: [true, qS('.kartu_danaUmum')]
                                        }
                                    }
                                    return landEventHandler(tempRequiredLandEventData, null, outerEvent)
                                }, 1000);
                            }
                        }
                    }
                }
                else if(splitEffect[0] === 'money_or_move') {
                    const selectMoney = cE('input')
                    const selectMove = cE('input')
                    // required elements for confirm dialog
                    const { types, buttons, attributes, classes, text } = {
                        types: fillTheElementsForDialog('button', 2),
                        buttons: fillTheElementsForDialog([selectMoney, selectMove], null, true),
                        attributes: fillTheElementsForDialog('class', 2),
                        classes: fillTheElementsForDialog(['selectMoney', 'selectMove'], null, true),
                        text: fillTheElementsForDialog([`Ambil Uang ${emoji.pray}`, `Maju 2 langkah ${emoji.sunglas}`], null, true)
                    }
                    // create choice button dialog
                    confirmDialog(cardText, types, buttons, attributes, classes, text)
                    for(let button of qSA('.selectMoney, .selectMove')) {
                        button.onclick = (ev) => {
                            // jika anda jadi maling
                            if(ev.target.value.match('Uang')) {
                                // replace the text without buttons
                                qS('.confirm_box').innerText = `\n${cardText}\n---\nHaram nian lanang ko..`
                                cardsEventData.moneyLeft = endTurnMoney + 50_000
                                // if no changes on city, just make it null
                                cardsEventData.cities = null
                                return resolve(cardsEventData)
                            }
                            // jika iman anda kuat
                            else if(ev.target.value.match('Maju')) {
                                // replace the text without buttons
                                qS('.confirm_box').innerText = `\n${cardText}\n---\nOrang baik ${emoji.sweatJoy} ${emoji.pray}`
                                // set playerDadu 
                                const customDadu = 2
                                // trigger the kocok dadu button
                                kocokDaduTrigger(mods, giliran, customDadu)
                                qS('.acakDadu').disabled = false
                                return qS('.acakDadu').click()
                            }
                        }
                    }
                }
            })
            .then(tempCardsEventData => {
                const tempRequiredLandEventData = {
                    giliran: giliran,
                    playerDiceMove: tempPlayerPosNow,
                    playerLaps: +qS('.putaranTeks').innerText.match(/\d+/)
                }
                if(tempCardsEventData.cities === null)
                    tempCardsEventData.cities = playersTurnObj[giliran].harta_kota
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                landEventHandler(tempRequiredLandEventData, tempCardsEventData)
            })
            break
        case 'disaster':
            cardsEventData.moneyLeft = endTurnMoney
            // if no changes on city, just make it null
            if(splitEffect.length === 1) {
                cardsEventData.cities = null
                confirmDialog(cardText)
                setTimeout(() => {
                    qS('.confirm_box').firstChild.innerText += `\n---\n${splitEffect[0]}`
                }, 1000);
            }
            else if(splitEffect.length === 2) {
                cardsEventData.cities = manageCities(splitEffect[0], splitEffect[1], 'disaster')
                confirmDialog(cardText)
                setTimeout(() => {
                    qS('.confirm_box').firstChild.innerText += `\n---\nKota ${splitEffect[0]} hancur bang ${emoji.catShock}`
                }, 1000);
            }
            return cardsEventData
    }
}

function choosingCard(cardEventType, chances, giliran, endTurnMoney) {
    const tempCardList = {}
    console.log(chances);
    // chances < 9
    if(chances < 9) {
        switch(cardEventType) {
            // dana umum
            case 'Dana Umum':
                // card list
                tempCardList.cards = [ 
                    'Gaji bulanan sudah cair, anda mendapatkan 160.000',
                    'Bayar tagihan listrik & air 100.000',
                    'Menjual 1 kota yang dimiliki (acak)'
                ]
                // card types
                tempCardList.types = ['gainMoney', 'loseMoney', 'sellCity']
                // card effects
                tempCardList.effects = [160_000, 100_000, getRandomCity(giliran, 'sell')]
                break
            // kesempatan
            case 'Kesempatan':
                tempCardList.cards = [
                    'Anda tertangkap basah korupsi, masuk penjara dan denda 90% dari total uang',
                    'Anda mendapatkan uang kaget sebanyak 200.000',
                    'Kartu bebas penjara'
                ]
                // card types
                tempCardList.types = ['moveForward', 'gainMoney', 'specialCard']
                // card effects
                tempCardList.effects = [`auto-penjara90%`, 200_000, 'bebas-penjara']
                break
        }
    }
    // chances >= 9 && chances < 25
    else if(chances >= 9 && chances < 25) {
        switch(cardEventType) {
            // dana umum
            case 'Dana Umum':
                tempCardList.cards = [
                    'Bayar rumah sakit 50.000',
                    'Preman pinjol datang ke rumah, bayar hutang 60.000',
                    `Gilang si belok memberi anda uang 5.000 ${emoji.sweatJoy}`,
                    `Kartu anti pajak ${emoji.sunglas}`,
                    'Pilih kota anda yang ingin dituju'
                ]
                // card types
                tempCardList.types = ['loseMoney', 'loseMoney', 'gainMoney', 'specialCard', 'moveForward']
                // card effects
                tempCardList.effects = [50_000, 60_000, 5_000, 'anti-pajak', 'manual']
                break
            // kesempatan
            case 'Kesempatan':
                tempCardList.cards = [
                    'Menuju kota punya orang lain',
                    'Gilang menjatuhkan ichi ochanya, Anda mundur 3 langkah untuk mengembalikan',
                    'Adu nasib, masuk parkir bebas atau masuk penjara',
                    'Kartu nerf parkir bebas',
                    'Gempa bumi, 1 bangunan roboh #menangid'
                ]
                // card types
                tempCardList.types = ['moveForward', 'moveBackward', 'moveForward', 'specialCard', 'disaster']
                // card effects
                // ### UNTUK GEMPA BUMI, PILIH KOTA RANDOM (JIKA PUNYA) LALU HAPUS PROP YG PALING AKHIR (KECUALI TANAH)
                tempCardList.effects = ['auto-kotaOrangLain', -3, 'auto-aduNasib', 'nerf-parkir', getDestroyTarget()]
                break
        }
    }
    // chances >= 25 && chances < 51
    else if(chances >= 25 && chances < 51) {
        switch(cardEventType) {
            // dana umum
            case 'Dana Umum':
                tempCardList.cards = [
                    'Gilang sang hecker meretas akun bank anda dan kehilangan uang 20.000',
                    'Kartu penghambat rezeki \u{1F5FF}',
                    'Mobil anda rusak, bayar biaya perbaikan 35.000',
                    'Kartu nerf pajak 35%',
                    'Anda mendapat uang 20.000 dikali jumlah angka pada koin yang dipilih'
                ]
                // card types
                tempCardList.types = ['loseMoney', 'specialCard', 'loseMoney', 'specialCard', 'miniGame']
                // card effects
                tempCardList.effects = [20_000, 'penghambat-rezeki', 35_000, 'nerf-pajak', 'choose_a_coin']
                break
            // kesempatan
            case 'Kesempatan':
                tempCardList.cards = [ 
                    'Renovasi rumah, bayar 30% dari total uang',
                    'Anda lari dikejar biawak, mundur 2 langkah',
                    'Pilih maju sampai start atau ambil kartu dana umum',
                    'Kartu dadu gaming \u{1F633}',
                    'Upgrade 1 kota yang anda miliki (acak)'
                ]
                // card types
                tempCardList.types = ['loseMoney', 'moveBackward', 'miniGame', 'specialCard', 'buyCity']
                // card effects
                tempCardList.effects = [(endTurnMoney * .3), -2, 'move_or_draw', 'dadu-gaming', getRandomCity(giliran, 'buy')]
                break
        }
    }
    // chances >= 51 && chances < 95
    else if(chances >= 1 && chances < 95) {
        switch(cardEventType) {
            // dana umum
            case 'Dana Umum':
                tempCardList.cards = [
                    'Hadiah dari bank, anda mendapatkan 40.000',
                    'Anda mendapat warisan 65.000',
                    'Anda ulang tahun hari ini, dapat 15.000 dari tiap player'
                ]
                // card types
                tempCardList.types = ['gainMoney', 'gainMoney', 'gainMoney']
                // card effects
                tempCardList.effects = [40_000, 65_000, (15_000 * playersTurn.length-1)]
                break
            // kesempatan
            case 'Kesempatan':
                tempCardList.cards = [
                    'Kaki anda tersandung, maju 1 langkah',
                    'Anda menemukan uang 30.000 di kantong celana',
                    'Anda menemukan uang 50.000 di jalan, ambil uang atau maju 2 langkah'
                ]
                // card types
                tempCardList.types = ['moveForward', 'gainMoney', 'miniGame']
                // card effects
                tempCardList.effects = ['auto-oneStep', 30_000, 'money_or_move']
                break
        }
    }
    // chances >= 95 && chances < 100
    else if(chances >= 95 && chances < 100) {
        switch(cardEventType) {
            // dana umum
            case 'Dana Umum':
            // kesempatan
            case 'Kesempatan':
                tempCardList.cards = ['Kartu upgrade kota']
                // card types
                tempCardList.types = ['specialCard']
                // card effects
                tempCardList.effects = ['upgrade-kota']
                break
        }
    }
    return tempCardList
}

function getRandomCity(giliran, condition) {
    // find city for the card effect 
    const findCities = playerCityList(giliran)
    const randomCityObj = {}
    if(findCities.length > 0) {
        const cityIndex = Math.floor(Math.random() * findCities.length)
        randomCityObj.name = findCities[cityIndex].classList[0].split('_')[1]
        randomCityObj.prop = findCities[cityIndex].classList[0].split('_')[2]
        randomCityObj.price = +findCities[cityIndex].classList[0].split('_')[3]
        randomCityObj.resultSell = `${randomCityObj.name}-${randomCityObj.price}`
        randomCityObj.resultBuy = [true, findCities[cityIndex]]
    }
    else if(findCities.length === 0) {
        randomCityObj.resultSell = `Anda belum punya kota ${emoji.joy}`
        randomCityObj.resultBuy = `Anda belum punya kota ${emoji.joy}`
    }
    return condition === 'sell' ? randomCityObj.resultSell : randomCityObj.resultBuy
}

function gambleFreeOrJail(destinationPos, tempPlayerPosNow, mods, giliran) {
    const customDadu = (destinationPos > tempPlayerPosNow 
                    ? destinationPos - tempPlayerPosNow 
                    : (destinationPos + 28) - tempPlayerPosNow)
    // change confirm_box text
    setTimeout(() => {
        qS('.confirm_box').firstChild.innerText += `\n---\nMenuju ke ${destinationPos === 10 ? 'Penjara' : 'Parkir Bebas'}`
    }, 1000);
    // trigger the kocok dadu button
    kocokDaduTrigger(mods, giliran, customDadu)
    qS('.acakDadu').disabled = false
    return qS('.acakDadu').click()
}

function getDestroyTarget() {
    const findMyCity = playersTurnObj.map(v => {return v.username}).indexOf(myGameData.username)
    const splitPerCity = playersTurnObj[findMyCity].harta_kota.split(';')
    const destroyTarget = Math.floor(Math.random() * splitPerCity.length)
    const splitPerProp = splitPerCity[destroyTarget].split(',')
    const destroyObj = {
        city: splitPerProp[0].split('-')[0],
        prop: splitPerProp[splitPerProp.length-1] === 'tanah' ? null : splitPerProp[splitPerProp.length-1]
    }
    return destroyObj.prop === null ? 'Tanah hungkul nya.. kumaha atuh nteu tiasa' : `${destroyObj.city}-${destroyObj.prop}`
}