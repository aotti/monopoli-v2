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
    // === start lands event ===
    // if stepOnCity has value AND stepOnCity[0] not null, 
    // it means the player is on the right land to buy city 
    if(stepOnCity && stepOnCity[0] && playerLaps > 1) {
        // step sound
        qS('#pMasukLokasi').play();
        // setting for buying text
        const land = stepOnCity[1]
        const cityName = land.innerText.split(' ')[1]
        const landName = land.innerText.match(new RegExp(`Kota ${cityName}`))[0]
        const propertyType = land.classList[0].split('_')[2]
        const landPrice = +land.classList[0].split('_')[3]
        // text when player gonna buy city
        const buyingText = `Apakah Anda ingin membeli ${propertyType} di ${landName} dengan harga Rp ${currencyComma(landPrice)}?`
        // confirm button
        const buyAgree = cE('input')
        const buyDisagree = cE('input')
        const { types, buttons, attributes, classes, text } = {
            types: fillTheElementsForDialog('button', 2),
            buttons: fillTheElementsForDialog([buyAgree, buyDisagree], null, true),
            attributes: fillTheElementsForDialog('class', 2),
            classes: fillTheElementsForDialog(['buyAgree', 'buyDisagree'], null, true),
            text: fillTheElementsForDialog(['Yakali gk beli', 'Skip dulu'], null, true)
        }
        // create buying city dialog
        confirmDialog(buyingText, types, buttons, attributes, classes, text)
        // set confirm box top position
        qS('.confirm_box').style.top = '40%'
        // return confirm button and required data
        const landData = {
            buttons: qSA('.buyAgree, .buyDisagree'),
            data: {
                event: 'buyingCity',
                cityName: cityName,
                cityProp: propertyType,
                cityPrice: landPrice
            }
        }
        return landData
    }
    else if(stepOnParking && stepOnParking[0] && playerLaps > 1) {
        function parkingButtonsAndNumbers(type) {
            let tempArray = []
            for(let i=0; i<28; i++) {
                if(i == 9 || i == 23) continue
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
    }
}

function buyingCityFilter() {

}

function buyingCityEvent(endTurnMoney, data) {
    if(data.selectedButton == 'buyAgree') {
        const buyingCityData = {}
        if(endTurnMoney >= data.cityPrice) {
            feedbackTurnOn(`Berhasil membeli ${data.cityProp} di Kota ${data.cityName}`)
            feedbackTurnOff()
            // money left after bought a city
            buyingCityData.moneyLeft = endTurnMoney - data.cityPrice
            // ### BUAT FUNCTION UNTUK ISI harta_kota
            buyingCityData.harta_kota = buyingCityFilter(data.cityName, data.cityProp)
            return buyingCityData
        }
        else {
            feedbackTurnOn(`h3h3 kaw misqueen ya...`)
            feedbackTurnOff()
            // money left after bought a city
            buyingCityData.moneyLeft = endTurnMoney - data.cityPrice
            // ### BUAT FUNCTION UNTUK ISI harta_kota
            buyingCityData.harta_kota = null
            return buyingCityData
        }
    }
    else if(data.selectedButton == 'buyDisagree') {
        console.log('mending jaga lilin bang');
    }
}