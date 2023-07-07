function landEventHandler(requiredLandEventData) {
    // required data if land event happens
    const { mods, giliran, endTurnMoney, playerCities, playersTurnShape, playerDiceMove, playerLaps } = requiredLandEventData
    // check land event 
    const landsAction = new Promise((resolve, reject) => {
        // variable to save retrieved data from land event
        let landEventData = {
            // the value is to prevent if the player dont get any land event
            moneyLeft: endTurnMoney,
            cities: playerCities
        }
        // when the player step on any land event
        const getDataAfterLandEvent = steppedOnAnyLand(playersTurnShape, playerLaps)
        // if player dont get any land event after stop moving
        if(getDataAfterLandEvent == null) 
            return playerTurnEnd(giliran, playerDiceMove, playerLaps, landEventData)
        // if the player get any land event
        const { buttons, data } = getDataAfterLandEvent
        // if the land event have no buttons
        if(buttons === null) {
            const returnedLandEventData = whichEventIsOccured(data, landEventData)
            return resolve(returnedLandEventData)
        }
        // if the land event have buttons
        for(let button of buttons) {
            button.onclick = (ev) => {
                // get button classList to know which button is clicked
                data.selectedButton = ev.target.classList[0]
                // check which event is occured
                const returnedLandEventData = whichEventIsOccured(data, landEventData, ev)
                // if the player is on freeParking, dont resolve
                if(returnedLandEventData == null) return
                // other than freeParking, resolve
                return resolve(returnedLandEventData)
            }
        }
    })
    // after land event done
    landsAction.then(returnedLandEventData => {
        playerTurnEnd(giliran, playerDiceMove, playerLaps, returnedLandEventData)
    })
    // INNER FUNCTION 
    // check which event is occured
    function whichEventIsOccured(data, landEventData, eventButton = null) {
        let dataEvent = data.event
        // if data.event is array, only get the index 0 for switch to prevent error
        if(typeof dataEvent === 'object') 
            dataEvent = dataEvent[0]
        switch(dataEvent) {
            // buying city land event
            case 'buyingCity':
                qS('.confirm_box').remove()
                landEventData = buyingCityEvent(endTurnMoney, data)
                if(landEventData.cities === null)
                    landEventData.cities = playerCities
                return landEventData
            // free parking land event
            case 'freeParking':
                const tempPlayerPosNow = +playersTurnShape.parentElement.classList[0].match(/\d+/)
                const destinationPos = +eventButton.target.value
                qS('.confirm_box').innerText = `---------\nMenuju ke petak ${destinationPos}\n---------`
                return freeParkingEvent(mods, giliran, tempPlayerPosNow, destinationPos)
            // paying tax to the city owner
            case 'taxCity':
                landEventData = taxCityEvent(endTurnMoney, data)
                if(landEventData.cities === null)
                    landEventData.cities = playerCities
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
            // get into jail
            case 'imprisoned':
                landEventData = imprisonedEvent(endTurnMoney, data)
                if(landEventData.cities === null)
                    landEventData.cities = playerCities
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
            // cursed city event
            case 'cursedCity':
                landEventData = curseLandEvent(endTurnMoney, data)
                if(landEventData.cities === null)
                    landEventData.cities = playerCities
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
            // special city event
            case 'specialCity':
                landEventData = specialLandEvent(endTurnMoney, data)
                if(landEventData.cities === null)
                    landEventData.cities = playerCities
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
        }
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