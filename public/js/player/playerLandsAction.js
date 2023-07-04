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
    // for similar value
    else if(customValue === false) {
        for(let i=0; i<loopLength; i++) {
            arrayElements[i] = value
        }
    }
    return arrayElements
}

function steppedOnAnyLand(playersTurnShape, playerLaps) {
    // regex for lands
    const regexBuyCity = new RegExp('.*tanah.\\d+.|.*1rumah.\\d+.'+myGameData.username+'|.*2rumah.\\d+.'+myGameData.username+'|.*2rumah1hotel.\\d+.'+myGameData.username)
    const regexTaxCity = new RegExp('.*1rumah.\\d+.*|.*2rumah.\\d+.*|.*2rumah1hotel.\\d+.*|.*komplek.\\d+.*')
    // get land element
    const prevSib = playersTurnShape.previousSibling
    const prevSibObj = {}
    Object.defineProperties(prevSibObj,{
        pSib : {enumerable: true, value: prevSib},
        pSib2 : {enumerable: true, get: function(){return this.pSib ? this.pSib.previousSibling : null}},
        pSib3 : {enumerable: true, get: function(){return this.pSib2 ? this.pSib2.previousSibling : null}},
        pSib4 : {enumerable: true, get: function(){return this.pSib3 ? this.pSib3.previousSibling : null}},
        pSib5 : {enumerable: true, get: function(){return this.pSib4 ? this.pSib4.previousSibling : null}}
    });
    // check which land is player on
    const stepOnCity = getTheLandElement(Object.values(prevSibObj), regexBuyCity)
    const stepOnParking = getTheLandElement(Object.values(prevSibObj), 'area_parkir')
    const stepOnTax = getTheLandElement(Object.values(prevSibObj), regexTaxCity)
    const stepOnJail = getTheLandElement(Object.values(prevSibObj), 'area_penjara')
    const stepOnCurse = getTheLandElement(Object.values(prevSibObj), 'cursed')
    const stepOnSpecial = getTheLandElement(Object.values(prevSibObj), 'special')
    // === start lands event ===
    // if stepOnCity has value AND stepOnCity[0] not null, 
    // it means the player is on the right land to buy city 
    if((stepOnCity || stepOnSpecial) && (stepOnCity[0] || stepOnSpecial[0]) && playerLaps > 1) {
        // to remove freeParking confirm box after playerMoves done
        if(qS('.confirm_box'))
            qS('.confirm_box').remove()
        // step sound
        qS('#pMasukLokasi').play();
        // setting for buying text
        const land = stepOnSpecial[1] || stepOnCity[1]
        // only city name, ex: Jakarta
        const cityName = land.classList[0].split('_')[1]
        // full city name, ex: Kota Jakarta / Area Khusus-1
        const landName = land.innerText.match(new RegExp(`(Kota|Area) ${cityNameFirstLetter(cityName)}`))[0]
        // property type, ex: tanah/1rumah/special
        const propertyType = land.classList[0].split('_')[2]
        // the city price
        const landPrice = +land.classList[0].split('_')[3]
        // other
        let buyingOrSpecialText = null
        let eventType = null
        let specialType = null
        // if step on special
        if(cityName.match(/khusus/)) {
            // if the special city is still available
            if(land.classList[0].split('_')[4] == null) {
                // text when player gonna buy city
                buyingOrSpecialText = `Apakah Anda ingin membeli ${landName} dengan harga Rp ${currencyComma(landPrice)}?`
                eventType = 'buyingCity'
            }
            // if the special city owner is step on its city
            else if(land.classList[0].split('_')[4] == myGameData.username) {
                // text when player gonna pay special tax
                buyingOrSpecialText = `Anda mendapat uang dari ${landName} sebesar Rp ${currencyComma(landPrice)} ${emoji.sunglas}`
                eventType = 'specialCity'
                specialType = 'profitSpecial'
            }
            // if other player is step on someone special city
            else if(land.classList[0].split('_')[4] != myGameData.username) {
                // text when player gonna pay special tax
                buyingOrSpecialText = `Anda terkena pajak di ${landName} sebesar Rp ${currencyComma(landPrice)} ${emoji.catShock}`
                eventType = 'specialCity'
                specialType = 'taxSpecial'
            }
        }
        // if step on city
        else {
            // text when player gonna buy city
            buyingOrSpecialText = `Apakah Anda ingin membeli ${propertyType == '2rumah1hotel' ? '1hotel' : propertyType} di ${landName} dengan harga Rp ${currencyComma(landPrice)}?`
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
            confirmDialog(buyingOrSpecialText, types, buttons, attributes, classes, text)
        }
        // confirm dialog when paying or getting money
        else if(eventType == 'specialCity') {
            // create special tax/profit dialog
            confirmDialog(buyingOrSpecialText)
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
        // to remove freeParking confirm box after playerMoves done
        if(qS('.confirm_box'))
            qS('.confirm_box').remove()
        const land = stepOnTax[1]
        // city that player stepped on
        const cityName = land.innerText.split(/\W/)[1]
        // tax amount
        const cityTaxAmount = +land.classList[0].split('_')[3]
        // used to send the money to the right player
        const cityOwner = land.classList[0].split('_')[4]
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
                cityTaxAmount: cityTaxAmount
            }
        }
        return landData
    }
    // free parking, move to other land according to player choice
    else if(stepOnParking && stepOnParking[0] && playerLaps > 1) {
        function parkingButtonsAndNumbers(type) {
            let tempArray = []
            for(let i=0; i<28; i++) {
                // 6 9 14 19 23 = kota khusus, penjara, parkir bebas
                if(i == 6 || i == 9 || i == 14 || i == 19 || i == 23) continue
                tempArray[i] = (type == 'button' ? cE('input') : i+1)
            }
            return tempArray
        }
        // text when player choosing parking number
        const parkingText = `Pilih nomor tujuan... `
        // player only can pick 26 parking numbers (cant pick jail or parking) 
        // parking button
        const parkingButtons = parkingButtonsAndNumbers('button')
        const parkingNumbers = parkingButtonsAndNumbers('number')
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
        // text when player pay taxes
        const taxText = `Semoga Anda mendapat hidayah ${emoji.pray} tapi kena azab dulu ${emoji.sunglas}`
        // create buying city dialog
        confirmDialog(taxText)
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
}

// buying city event
function buyingCityEvent(endTurnMoney, data) {
    const buyingCityData = {}
    // if player agree to buy city
    if(data.selectedButton == 'buyAgree') {
        // then have enough money
        if(endTurnMoney >= data.cityPrice) {
            feedbackTurnOn(`Berhasil membeli ${data.cityProp} di Kota ${data.cityName}`)
            feedbackTurnOff()
            // money left after bought a city
            buyingCityData.moneyLeft = endTurnMoney - data.cityPrice
            // add new city/prop to player cities
            buyingCityData.cities = buyingCityFilter(data.cityName, data.cityProp)
            return buyingCityData
        }
        // dont have enough money
        else {
            feedbackTurnOn(`h3h3 kaw misqueen ya...`)
            feedbackTurnOff()
            // money left if not buying a city
            buyingCityData.moneyLeft = endTurnMoney
            // no change in the player cities
            buyingCityData.cities = null
            return buyingCityData
        }
    }
    else if(data.selectedButton == 'buyDisagree') {
        feedbackTurnOn(`mending jaga lilin bang...`)
        feedbackTurnOff()
        // money left if not buying a city
        buyingCityData.moneyLeft = endTurnMoney
        // no change in the player cities
        buyingCityData.cities = null
        return buyingCityData
    }
}

function buyingCityFilter(cityName, cityProp) {
    // kota-tanah,1rumah,2rumah,2rumah1hotel;kota2-tanah,1rumah,2rumah,2rumah1hotel
    // find your data in playersTurnObj
    const findYourCity = playersTurnObj.map(v => {return v.username}).indexOf(myGameData.username)
    if(findYourCity !== -1) {
        // get your harta_kota
        const yourCity = playersTurnObj[findYourCity].harta_kota
        switch(yourCity) {
            // first time bought a city
            case '':
                return `${cityName}-${cityProp}`
            // the next time bought a city
            default:
                // split data to per city
                const splitPerCity = yourCity.split(';') 
                // find city that player is just bought 
                const findPerCity = splitPerCity.map(v => {return v.includes(cityName)}).indexOf(true)
                // if bought new city, push to array
                if(findPerCity === -1) 
                    splitPerCity.push(`${cityName}-${cityProp}`)
                // if bought new city property, replace the old city
                else if(findPerCity !== -1) {
                    const newCityProp = `${splitPerCity[findPerCity]},${cityProp}`
                    splitPerCity.splice(findPerCity, 1, newCityProp)
                }
                return splitPerCity.join(';')
        }
    }
}

// free parking event
function freeParkingEvent(mods, giliran, tempPlayerPosNow, destinationPos) {
    const customDadu = (destinationPos > tempPlayerPosNow 
                    ? destinationPos - tempPlayerPosNow 
                    : (destinationPos + 28) - tempPlayerPosNow)
    // trigger the kocok dadu button
    kocokDaduTrigger(mods, giliran, customDadu)
    qS('.acakDadu').disabled = false
    qS('.acakDadu').click()
}

// tax city event
function taxCityEvent(endTurnMoney, data) {
    const taxCityData = {}
    // money left after paying tax
    taxCityData.moneyLeft = endTurnMoney - data.cityTaxAmount
    // no change in the player cities
    taxCityData.cities = null
    // city owner who is the city that player stepped on
    taxCityData.cityOwner  = data.cityOwner
    // the tax amount that player have to pay
    taxCityData.cityTaxAmount = data.cityTaxAmount
    return taxCityData
}

// imprisoned event
function imprisonedEvent(endTurnMoney, data) {
    const imprisonedData = {}
    // no change in the money left
    imprisonedData.moneyLeft = endTurnMoney
    // no change in the player cities
    imprisonedData.cities = null
    // prison status true
    imprisonedData.imprisoned = data.penjara
    return imprisonedData
}

// curse land event
function curseLandEvent(endTurnMoney, data) {
    const curseLandData = {}
    // money left after paying curse
    curseLandData.moneyLeft = endTurnMoney - data.curseAmount
    // no change in the player cities
    curseLandData.cities = null
    return curseLandData
}

// special land event
function specialLandEvent(endTurnMoney, data) {
    const specialLandData = {}
    if(data.event[1] == 'taxSpecial') {
        // money left after paying special tax
        specialLandData.moneyLeft = endTurnMoney - data.cityPrice
        // no change in the player cities
        specialLandData.cities = null
    }
    else if(data.event[1] == 'profitSpecial') {
        // money left after getting special profit
        specialLandData.moneyLeft = endTurnMoney + data.cityPrice
        // no change in the player cities
        specialLandData.cities = null
    }
    return specialLandData
}