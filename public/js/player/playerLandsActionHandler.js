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
            // get into jail
            case 'cursedCity':
                landEventData = curseLandEvent(endTurnMoney, data)
                if(landEventData.cities === null)
                    landEventData.cities = playerCities
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
            case 'specialCity':
                landEventData = specialLandEvent(endTurnMoney, data)
                if(landEventData.cities === null)
                    landEventData.cities = playerCities
                setTimeout(() => { qS('.confirm_box').remove() }, 3000);
                return landEventData
        }
    }
}
