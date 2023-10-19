function getTheLandElement(all_prevSib, regex) {
    for(let all_pSib of all_prevSib) {
        // if the regex include 'komplek' it must be tax land
        if(String(regex).includes('komplek')) {
            if(all_pSib && all_pSib.classList[0] && all_pSib.classList[0].match(regex) && !all_pSib.classList[0].match(regex)[0].includes(myGameData.username))
                return [all_pSib.classList[0].match(regex), all_pSib];
        }
        else {
            // if the player is on land that include word 'kota / area / kartu' in the classList 
            if(all_pSib && all_pSib.classList[0] && all_pSib.classList[0].match(/kota_|area_|kartu/)) {
                // get the land and return the value
                return [all_pSib.classList[0].match(regex), all_pSib];
            }
        }
    }
}

function fillTheElementsForDialog(value, loopLength = null, customValue = false) {
    let arrayElements = []
    // for custom value
    if(customValue === true) {
        for(let i in value) {
            arrayElements[i] = value[i]
        }
    }
    // for static value
    else if(customValue === false) {
        for(let i=0; i<loopLength; i++) {
            arrayElements[i] = value
        }
    }
    return arrayElements
}

/**
 * @param {String} type determine what value is gonna be created (button / text only)
 * @param {Boolean} parking true = for free parking event, false = other event
 * @param {Array<String|Number>} customArray for custom button name
 * @param {String} prefix for custom className, ex: koin_1, koin_2 
 * @returns array with button / text values
 */
function createButtonsOrTextValue(type, parking, customArray = null, prefix = null) {
    const tempArray = []
    if(parking === true) {
        for(let i=0; i<28; i++) {
            // 6 9 14 19 23 = kota khusus, penjara, parkir bebas
            if(i == 6 || i == 9 || i == 14 || i == 19 || i == 23) continue
            tempArray[i] = (type == 'button' ? cE('input') : i+1)
        }
    }
    else if(parking === false) {
        for(let i in customArray) 
            tempArray[i] = (type == 'button' ? cE('input') : prefix + customArray[i])
    }
    return tempArray
}

function steppedOnAnyLand(playersTurnShape, playerLaps, landEventDataCards, outerEventData = null) {
    // regex for lands
    const regexBuyCity = new RegExp('.*tanah.\\d+.|.*1rumah.\\d+.'+myGameData.username+'|.*2rumah.\\d+.'+myGameData.username+'|.*2rumah1hotel.\\d+.'+myGameData.username)
    const regexTaxCity = new RegExp('.*1rumah.\\d+.*|.*2rumah.\\d+.*|.*2rumah1hotel.\\d+.*|.*komplek.\\d+.*')
    // get land element
    const prevSib = playersTurnShape ? playersTurnShape.previousSibling : null
    const prevSibObj = {}
    // if player element exist, find what land is the player step on
    if(prevSib) {
        Object.defineProperties(prevSibObj,{
            pSib : {enumerable: true, value: prevSib},
            pSib2 : {enumerable: true, get: function(){return this.pSib ? this.pSib.previousSibling : null}},
            pSib3 : {enumerable: true, get: function(){return this.pSib2 ? this.pSib2.previousSibling : null}},
            pSib4 : {enumerable: true, get: function(){return this.pSib3 ? this.pSib3.previousSibling : null}},
            pSib5 : {enumerable: true, get: function(){return this.pSib4 ? this.pSib4.previousSibling : null}}
        });
    }
    // check which land is player on
    const stepOnCity = (outerEventData && outerEventData.type == 'buyCity' ? outerEventData.elements : null) || 
                        getTheLandElement(Object.values(prevSibObj), regexBuyCity)
    const stepOnParking = getTheLandElement(Object.values(prevSibObj), 'area_parkir')
    const stepOnTax = getTheLandElement(Object.values(prevSibObj), regexTaxCity)
    const stepOnJail = getTheLandElement(Object.values(prevSibObj), 'area_penjara')
    const stepOnCurse = getTheLandElement(Object.values(prevSibObj), 'cursed')
    const stepOnSpecial = getTheLandElement(Object.values(prevSibObj), 'special')
    const stepOnCards = (outerEventData && outerEventData.type == 'kartu_danaUmum' ? outerEventData.elements : null) || 
                        getTheLandElement(Object.values(prevSibObj), 'kartu')
    // === start lands event ===
    const playerCards = landEventDataCards
    // remove any confirm box after playerMoves done
    if(qS('.confirm_box'))
        qS('.confirm_box').remove()
    // if stepOnCity has value AND stepOnCity[0] not null, 
    // it means the player is on the right land to buy city 
    if((stepOnCity || stepOnSpecial) && (stepOnCity[0] || stepOnSpecial[0]) && playerLaps > 1) {
        // setting for buying text
        const land = (stepOnSpecial ? stepOnSpecial[1] : null) || stepOnCity[1]
        // only city name, ex: Jakarta
        const cityName = land.classList[0].split('_')[1]
        // full city name, ex: Kota Jakarta / Area Khusus-1
        const landName = land.innerText.match(new RegExp(`(Kota|Area) ${cityNameFirstLetter(cityName)}`))[0]
        // property type, ex: tanah/1rumah/special
        const propertyType = land.classList[0].split('_')[2]
        // the city price
        const landPrice = +land.classList[0].split('_')[3]
        // other
        let normalOrSpecialText = null
        let eventType = null
        let specialType = null
        // if step on special
        if(cityName.match(/khusus/)) {
            // if the special city is still available
            if(land.classList[0].split('_')[4] == null) {
                // step sound
                qS('#pMasukLokasi').play();
                // text when player gonna buy city
                normalOrSpecialText = `Apakah Anda ingin membeli ${landName} dengan harga Rp ${currencyComma(landPrice)}?`
                eventType = 'buyingCity'
            }
            // if the special city owner is step on its city
            else if(land.classList[0].split('_')[4] == myGameData.username) {
                // step sound
                qS('#pKhususBuff').play();
                // text when player gonna pay special tax
                normalOrSpecialText = `Anda mendapat uang dari ${landName} sebesar Rp ${currencyComma(landPrice)} ${emoji.sunglas}`
                eventType = 'specialCity'
                specialType = 'profitSpecial'
            }
            // if other player is step on someone special city
            else if(land.classList[0].split('_')[4] != myGameData.username) {
                // step sound
                qS('#pKhususDebuff').play();
                // text when player gonna pay special tax
                normalOrSpecialText = `Anda terkena pajak di ${landName} sebesar Rp ${currencyComma(landPrice)} ${emoji.catShock}`
                eventType = 'specialCity'
                specialType = 'taxSpecial'
            }
        }
        // if step on city
        else {
            // step sound
            qS('#pMasukLokasi').play();
            // text when player gonna buy city
            normalOrSpecialText = `Apakah Anda ingin membeli ${propertyType == '2rumah1hotel' ? '1hotel' : propertyType} di ${landName} dengan harga Rp ${currencyComma(landPrice)}?`
            eventType = 'buyingCity'
        }
        // confirm dialog when buying city
        if(eventType == 'buyingCity') {
            // confirm button
            const buyAgree = cE('input')
            const buyDisagree = cE('input')
            // required elements for confirm dialog
            const { types, buttons, attributes, classes, text } = {
                types: fillTheElementsForDialog('button', 2),
                buttons: fillTheElementsForDialog([buyAgree, buyDisagree], null, true),
                attributes: fillTheElementsForDialog('class', 2),
                classes: fillTheElementsForDialog(['buyAgree', 'buyDisagree'], null, true),
                text: fillTheElementsForDialog(['Yakali gk beli', 'Skip dulu'], null, true)
            }
            // create buying city dialog
            confirmDialog(normalOrSpecialText, types, buttons, attributes, classes, text)
        }
        // confirm dialog when paying or getting money
        else if(eventType == 'specialCity') {
            // create special tax/profit dialog
            confirmDialog(normalOrSpecialText)
        }
        // set confirm box top position
        qS('.confirm_box').style.top = '40%'
        // return confirm button and required data
        const landData = {
            buttons: specialType ? null : qSA('.buyAgree, .buyDisagree'),
            data: {
                event: specialType ? [eventType, specialType] : eventType,
                cityName: cityName,
                cityProp: propertyType,
                cityPrice: landPrice
            }
        }
        return landData
    }
    // if the player stepped on city but it belongs to someone else, pay money to them
    else if(stepOnTax && stepOnTax[0] && playerLaps > 1) {
        // step sound
        qS('#pMasukPajak').play();
        const land = stepOnTax[1]
        // city that player stepped on
        const cityName = land.innerText.split(/\W/)[1]
        // tax amount
        let cityTaxAmount = +land.classList[0].split('_')[3]
        // used to send the money to the right player
        const cityOwner = land.classList[0].split('_')[4]
        // check anti / nerf pajak card
        const pajakCards = playerCards.match(/anti-pajak|nerf-pajak/)
        if(pajakCards) {
            // process the card
            const pajakCardsResults = specialCardsHandler('pajak-cards', {cards: playerCards, taxAmount: cityTaxAmount})
            // return value after card processed
            cityTaxAmount = pajakCardsResults.tempTaxAmount
            landEventDataCards = pajakCardsResults.tempCardsOwned
        }
        // text when player pay taxes
        const taxText = `Anda terkena pajak di Kota ${cityName} sebesar Rp ${currencyComma(cityTaxAmount)} ${emoji.catShock}`
        // create city tax dialog
        confirmDialog(taxText)
        // set confirm box top position
        qS('.confirm_box').style.top = '40%'
        // return confirm button and required data
        const landData = {
            buttons: null,
            data: {
                event: 'taxCity',
                cityOwner: cityOwner,
                cityTaxAmount: cityTaxAmount,
                // ### TAMBAH DATA UNTUK CARD USED
                pajakCards: landEventDataCards
            }
        }
        return landData
    }
    // free parking, move to other land according to player choice
    else if(stepOnParking && stepOnParking[0] && playerLaps > 1) {
        // step sound
        qS('#pMasukParkir').play();
        // text when player choosing parking number
        const parkingText = `Pilih nomor tujuan... `
        // check if the player has nerf parkir card 
        const nerfParkir = playerCards.match(/nerf-parkir/)
        // player only can pick 26 parking numbers (cant pick jail or parking) 
        // parking button
        const parkingButtons = nerfParkir === null 
                            ? createButtonsOrTextValue('button', true) 
                            : specialCardsHandler('nerf-parkir')
        const parkingNumbers = createButtonsOrTextValue('number', true)
        // required dialog elements 
        const { types, buttons, attributes, classes, text } = {
            types: fillTheElementsForDialog('button', 28),
            buttons: fillTheElementsForDialog(parkingButtons, null, true),
            attributes: fillTheElementsForDialog('class', 28),
            classes: fillTheElementsForDialog('parkingButtons', 28),
            text: fillTheElementsForDialog(parkingNumbers, null, true)
        }
        // create parking dialog
        confirmDialog(parkingText, types, buttons, attributes, classes, text)
        // set confirm box top position
        qS('.confirm_box').style.top = '35%'
        // return confirm button and required data
        const landData = {
            buttons: qSA('.parkingButtons'),
            data: {
                event: 'freeParking'
            }
        }
        return landData
    }
    // player going to jail and cant move
    else if(stepOnJail && stepOnJail[0] && playerLaps > 1) {
        // step sound
        qS('#pMasukPenjara').play();
        // text when player going to jail
        const jailText = `Semoga Anda mendapat hidayah ${emoji.pray} tapi kena azab dulu ${emoji.sunglas}`
        // create going to jail dialog
        confirmDialog(jailText)
        // set confirm box top position
        qS('.confirm_box').style.top = '40%'
        // return confirm button and required data
        const landData = {
            buttons: null,
            data: {
                event: 'imprisoned',
                penjara: true
            }
        }
        return landData
    }
    // only to deplete player money
    else if(stepOnCurse && stepOnCurse[0] && playerLaps > 1) {
        // step sound
        qS('#pKutukan').play();
        const land = stepOnCurse[1]
        const cursePrice = +land.classList[0].split('_')[3]
        const curseText = `Anda terkena kutukan sebesar Rp ${currencyComma(cursePrice)} ${emoji.sweatJoy} ${emoji.pray}`
        // create curse dialog
        confirmDialog(curseText)
        // set confirm box top position
        qS('.confirm_box').style.top = '40%'
        // return confirm button and required data
        const landData = {
            buttons: null,
            data: {
                event: 'cursedCity',
                curseAmount: cursePrice
            }
        }
        return landData
    }
    // player getting buff/debuff card
    else if(stepOnCards && stepOnCards[0] && playerLaps > 1) {
        // return confirm button and required data
        const landData = {
            buttons: null,
            data: {
                event: 'drawCard',
                cardType: (outerEventData ? outerEventData.type : null) || stepOnCards[1].classList[0]
            }
        }
        return landData
    }
}