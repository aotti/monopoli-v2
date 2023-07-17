function cardsEvent(mods, giliran, tempPlayerPosNow, endTurnMoney, data) {
    if(data.cardType == 'kartu_danaUmum') {
        return danaUmumCards(mods, giliran, tempPlayerPosNow, endTurnMoney)
    }
    else if(data.cardType == 'kartu_kesempatan') {

    }
}

function danaUmumCards(mods, giliran, tempPlayerPosNow, endTurnMoney) {
    qS('#pDanaUmum').play();
    // random number to pick cards
    const chances = Math.random() * 100
    // cards container
    const cardList = {}
    // pick cards and put into container
    // chances < 9
    if(chances < 9) {
        // card list
        cardList.cards = [
            'Gaji bulanan sudah cair, Anda mendapatkan 160.000',
            'Bayar tagihan listrik & air 100.000',
            'Menjual 1 kota yang Anda miliki (acak)'
        ]
        // card types
        cardList.types = ['gainMoney', 'loseMoney', 'sellCity']
        // find city for the card effect 
        const getRandomCity = playerCityList(giliran)
        const randomCityObj = {}
        if(getRandomCity.length > 0) {
            randomCityObj.index = Math.floor(Math.random() * getRandomCity.length)
            randomCityObj.name = getRandomCity[randomCityObj.index].classList[0].split('_')[1]
            randomCityObj.price = +getRandomCity[randomCityObj.index].classList[0].split('_')[3]
            randomCityObj.result = `${randomCityObj.name}-${randomCityObj.price}`
        }
        else if(getRandomCity.length === 0) 
            randomCityObj.result = `Anda belum punya kota ${emoji.joy}`
        // card effects
        cardList.effects = [160_000, 100_000, randomCityObj.result]
    }
    // chances >= 9 && chances < 25
    else if(chances >= 9 && chances < 25) {
        cardList.cards = [
            'Bayar rumah sakit 50.000',
            'Debt collector datang ke rumah, bayar hutang 60.000',
            'Gilang si baik hati memberi anda uang 5.000',
            'Kartu anti pajak \u{1F60E}',
            'Pilih kota anda yang ingin dituju'
        ]
        // card types
        cardList.types = ['loseMoney', 'loseMoney', 'gainMoney', 'specialCard', 'moveForward']
        // card effects
        cardList.effects = [50_000, 60_000, 5_000, 'anti-pajak', null]
    }
    // chances >= 25 && chances < 51
    else if(chances >= 25 && chances < 51) {
        cardList.cards = [
            'Gilang sang hecker meretas akun bank anda dan kehilangan uang 20.000',
            'Kartu penghambat rezeki \u{1F5FF}',
            'Mobil anda rusak, bayar biaya perbaikan 35.000',
            'Kartu nerf pajak 35%',
            'Anda mendapat uang 20.000 dikali jumlah angka pada koin yang dipilih'
        ]
        // card types
        cardList.types = ['loseMoney', 'specialCard', 'loseMoney', 'specialCard', 'miniGame']
        // card effects
        cardList.effects = [20_000, 'penghambat-rezeki', 35_000, 'nerf-pajak', 'choose_a_coin']
    }
    // chances >= 51 && chances < 95
    else if(chances >= 51 && chances < 95) {
        cardList.cards = [
            'Hadiah dari bank, anda mendapatkan 40.000',
            'Anda mendapat warisan 65.000',
            'Anda ulang tahun hari ini, dapat 15.000 dari tiap player'
        ]
        // card types
        cardList.types = ['gainMoney', 'gainMoney', 'gainMoney']
        // card effects
        cardList.effects = [40_000, 65_000, (15_000 * playersTurn.length-1)]
    }
    else if(chances >= 95 && chances < 100) {
        cardList.cards = ['Kartu upgrade kota']
        // card types
        cardList.types = ['specialCard']
        // card effects
        cardList.effects = ['upgrade-kota']
    }
    // pick a card
    const cardPickIndex = Math.floor(Math.random() * cardList.cards.length)
    const cardPick = cardList.cards[cardPickIndex]
    const cardType = cardList.types[cardPickIndex]
    const cardEffect = cardList.effects[cardPickIndex]
    // check card type then activate the effect
    const cardText = `[Dana Umum]\n${cardPick}`
    const cardsObject = {
        mods: mods,
        giliran: giliran,
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
    const { mods, giliran, tempPlayerPosNow, endTurnMoney, cardType, cardEffect, cardText } = cardsObject
    const cardsEventData = {}
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
        case 'sellCity':
            const splitEffect = cardEffect.split('-')
            if(splitEffect.length === 1) {
                cardsEventData.moneyLeft = endTurnMoney
                // if no changes on city, just make it null
                cardsEventData.cities = null
                // create card dialog
                confirmDialog(`${cardText}\n\n${splitEffect[0]}`)
            }
            else if(splitEffect.length === 2) {
                cardsEventData.moneyLeft = endTurnMoney + +splitEffect[1]
                // if no changes on city, just make it null
                cardsEventData.cities = manageCities(splitEffect[0], null, 'sell')
                // create card dialog
                confirmDialog(`${cardText}\n\nKota ${splitEffect[0]} terjual ${emoji.catShock}`)
            }
            return cardsEventData
        case 'moveForward':
            // player select the forward number
            if(cardEffect === null) {
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
                // if the card needs player interaction
                for(let button of qSA('.parkingButtons')) {
                    button.onclick = (ev) => {
                        const destinationPos = +ev.target.value
                        const customDadu = (destinationPos > tempPlayerPosNow 
                                        ? destinationPos - tempPlayerPosNow 
                                        : (destinationPos + 28) - tempPlayerPosNow)
                        // change confirm_box text
                        qS('.confirm_box').innerText = `[Dana Umum]\nMenuju ke petak ${destinationPos}\n---------`
                        // trigger the kocok dadu button
                        kocokDaduTrigger(mods, giliran, customDadu)
                        qS('.acakDadu').disabled = false
                        return qS('.acakDadu').click()
                    }
                }
            }
            // determined forward number
            else if(typeof cardEffect === 'number') {

            }
            return
        case 'moveBackward':
            break
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
                if(cardEffect === 'choose_a_coin') {
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
    }
}