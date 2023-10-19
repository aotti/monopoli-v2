function refillLandEventData(newValue, defaultValue) {
    // if the object value is NULL, refill with default value
    if(newValue == null)
        return defaultValue
    // if the object value is NOT NULL, do nothing
    return newValue
}

function landEventHandler(requiredLandEventData, promiseResult = null, outerEvent = null) {
    // required data if land event happens
    const { 
        mods, giliran, 
        endTurnMoney, playerCities, playerCards,
        playersTurnShape, playerDiceMove, 
        playerLaps 
    } = requiredLandEventData
    // check land event 
    const landsAction = new Promise((resolve, reject) => {
        // if outer result is exist
        if(promiseResult) {
            return resolve(promiseResult)
        }
        // to save retrieved data from land event
        const landEventData = {
            // the value is to prevent if the player dont get any land event
            moneyLeft: endTurnMoney,
            cities: playerCities,
            cards: playerCards
        }
        // when the player step on any land event
        const getDataAfterLandEvent = (()=>{
            if(outerEvent) {
                switch(outerEvent.cond) {
                    case 'stepOnCity':
                    case 'drawCard':
                        return steppedOnAnyLand(null, playerLaps, landEventData.cards, outerEvent.data)
                }
            }
            return steppedOnAnyLand(playersTurnShape, playerLaps, landEventData.cards)
        })()
        // if player dont get any land event after stop moving
        if(getDataAfterLandEvent == null) 
            return playerTurnEnd(mods, giliran, playerDiceMove, playerLaps, landEventData)
        // if the player get any land event
        const { buttons, data } = getDataAfterLandEvent
        // if the land event have no buttons
        if(buttons === null) {
            const returnedLandEventData = whichEventIsOccured(data, landEventData)
            // if the player is on freeParking/something that need more interaction, dont resolve
            if(returnedLandEventData == null) return
            return resolve(returnedLandEventData)
        }
        // if the land event have buttons
        for(let button of buttons) {
            button.onclick = (ev) => {
                // get button classList to know which button is clicked
                data.selectedButton = ev.target.classList[0]
                // check which event is occured
                const returnedLandEventData = whichEventIsOccured(data, landEventData, ev)
                // if the player is on freeParking/something that need more interaction, dont resolve
                if(returnedLandEventData == null) return
                // other than freeParking, resolve
                return resolve(returnedLandEventData)
            }
        }
    })
    // after land event done
    landsAction.then(returnedLandEventData => {
        // if outerEvent.data.endturn === false|null, run realtime fetcher
        if(outerEvent && outerEvent.data.endturn === false) {
            // get random city for upgrade
            const cityForUpgrade = getRandomCity(giliran, 'buy')
            const cityForUpgradeSplit = cityForUpgrade[1].classList[0].split('_')
            // city details
            const cityNameForUpgrade = cityForUpgradeSplit[1]
            const propertyForUpgrade = cityForUpgradeSplit[2]
            const cityPriceForUpgrade = +cityForUpgradeSplit[3]
            // payload
            const jsonData = {
                user_id: myGameData.id,
                // upgraded city
                city_for_upgrade: cityNameForUpgrade, 
                // update city prop
                cities_after_upgrade: manageCities(cityNameForUpgrade, propertyForUpgrade, 'buy'), 
                // money left
                money_after_upgrade: endTurnMoney - cityPriceForUpgrade,
                // remove card
                cards_after_upgrade: manageCards('upgrade-kota', true)
            }
            // upgrade city in realtime
            fetcher('/upgradecity', 'PATCH', jsonData)
            .then(result => {
                return fetcherResults(result)
            })
            .catch(err => {
                return errorCapsule(err, anErrorOccured)
            })
        }
        // if outerEvent.data.endturn === true, end player turn
        return playerTurnEnd(mods, giliran, playerDiceMove, playerLaps, returnedLandEventData)
    })
    landsAction.catch(err => {
        return errorCapsule(err, anErrorOccured)
    })
    // INNER FUNCTION 
    // check which event is occured
    function whichEventIsOccured(data, landEventData, eventButton = null) {
        let dataEvent = data.event
        const tempPlayerPosNow = +playersTurnShape.parentElement.classList[0].match(/\d+/)
        // if data.event is array, only get the index 0 for switch to prevent error
        if(typeof dataEvent === 'object') 
            dataEvent = dataEvent[0]
        switch(dataEvent) {
            // buying city land event
            case 'buyingCity':
                // remove confirm box after button clicked
                qS('.confirm_box').remove()
                // run buying city event
                landEventData = buyingCityEvent(endTurnMoney, data)
                // if nothing changes on cities, refill the value
                landEventData.cities = refillLandEventData(landEventData.cities, playerCities)
                // if no card used, refill the value
                landEventData.cards = refillLandEventData(landEventData.cards, playerCards)
                return landEventData
            // free parking land event
            case 'freeParking':
                const destinationPos = +eventButton.target.value
                qS('.confirm_box').innerText = `---------\nMenuju ke petak ${destinationPos}\n---------`
                // run free parking event
                return freeParkingEvent(mods, giliran, tempPlayerPosNow, destinationPos)
            // paying tax to the city owner
            case 'taxCity':
                // run tax city event
                landEventData = taxCityEvent(endTurnMoney, data)
                // if nothing changes on cities, refill the value
                landEventData.cities = refillLandEventData(landEventData.cities, playerCities)
                // if no card used, refill the value
                landEventData.cards = refillLandEventData(data.pajakCards, playerCards)
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
            // get into jail
            case 'imprisoned':
                // run imprisoned event
                landEventData = imprisonedEvent(endTurnMoney, data)
                // if nothing changes on cities, refill the value
                landEventData.cities = refillLandEventData(landEventData.cities, playerCities)
                // if no card used, refill the value
                landEventData.cards = refillLandEventData(landEventData.cards, playerCards)
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
            // cursed city event
            case 'cursedCity':
                // run curse land event
                landEventData = curseLandEvent(endTurnMoney, data)
                // if nothing changes on cities, refill the value
                landEventData.cities = refillLandEventData(landEventData.cities, playerCities)
                // if no card used, refill the value
                landEventData.cards = refillLandEventData(landEventData.cards, playerCards)
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
            // special city event
            case 'specialCity':
                // run special land event
                landEventData = specialLandEvent(endTurnMoney, data)
                // if nothing changes on cities, refill the value
                landEventData.cities = refillLandEventData(landEventData.cities, playerCities)
                // if no card used, refill the value
                landEventData.cards = refillLandEventData(landEventData.cards, playerCards)
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
            // cards event
            case 'drawCard':
                // run cards event (kesempatan/dana umum)
                landEventData = cardsEvent(data, mods, giliran, playersTurnShape, tempPlayerPosNow, landEventData)
                // if the player is on freeParking/something that need more interaction, return null
                if(landEventData == null) return
                // if nothing changes on cities, refill the value
                landEventData.cities = refillLandEventData(landEventData.cities, playerCities)
                // if no card used, refill the value
                landEventData.cards = refillLandEventData(landEventData.cards, playerCards)
                setTimeout(() => { qS('.confirm_box').remove() }, 4000);
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
            buyingCityData.cities = manageCities(data.cityName, data.cityProp, 'buy')
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
    const fineAmount = getLocStorage('fineAmount')
    // no change in the money left
    imprisonedData.moneyLeft = fineAmount ? endTurnMoney - +fineAmount : endTurnMoney
    // no change in the player cities
    imprisonedData.cities = null
    // prison status true
    imprisonedData.imprisoned = data.penjara
    // set (local) prison status to true
    myPrisonCounter.status = data.penjara
    // remove fine from local storage
    fineAmount ? localStorage.removeItem('fineAmount') : null
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