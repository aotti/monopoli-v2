const qS = el => {return document.querySelector(el)}
const qSA = el => {return document.querySelectorAll(el)}
const cE = el => {return document.createElement(el)}
const docFrag = document.createDocumentFragment()
const anErrorOccured = `an error occured\ncheck 'Error Log' for details` 

/**
 * @returns random uuid version 4
 */
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/**
 * @param {String} name - set name for localStorage (string)
 * @param {String|Number} value - set value (string or number)
 */
function setLocStorage(name, value) { return localStorage.setItem(name, value); }
/**
 * @param {String} name - get localStorage value by name (string)
 */
function getLocStorage(name) { return localStorage.getItem(name) }

/**
 * @param {Number} money - add comma to currency for readability (number)
 */
function currencyComma(money) { return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}

/**
 * @param {String} cityName any name of city with lowercase string 
 * @returns city name but the first letter is Uppercase (if its special city, hyphen will be added)
 */
function cityNameFirstLetter(cityName) {
    const splitPerLetter = cityName.split('')
    // assuming the city name has a hyphen
    if(cityName.match(/\d/)) {
        const theLastIndex = splitPerLetter.length-1
        splitPerLetter.splice(theLastIndex, 0, '-')
    }
    splitPerLetter[0] = splitPerLetter[0].toUpperCase()
    return splitPerLetter.join('')
}

/**
 * @param {Number} giliran player's turn number 
 * @returns all cities owned by the player
 */
function playerCityList(giliran, resultCond = null) {
    const allLands = qSA('[class^=kota], [class*=special]')
    // array to contain cities
    const allOwnedCities = []
    // find cities
    for(let city of allLands) {
        const ownedCityRegex = new RegExp(playersTurn[giliran])
        // if the player own any city, insert to container
        if(city.classList[0].match(ownedCityRegex)) 
            allOwnedCities.push(city)
    }
    return allOwnedCities
}

/**
 * @param {String} cityName the name of the city to be purchased  
 * @param {String} cityProp the kind of property to be purchased 
 * @param {String} condition the condition on filtering the cities 
 * @returns all cities after being bought or remove the sold city
 */
function manageCities(cityName, cityProp, condition) {
    // kota-tanah,1rumah,2rumah,2rumah1hotel;kota2-tanah,1rumah,2rumah,2rumah1hotel
    // find your data in playersTurnObj
    const findYourCity = playersTurnObj.map(v => {return v.username}).indexOf(myGameData.username)
    if(findYourCity !== -1) {
        // get your harta_kota
        const yourCities = playersTurnObj[findYourCity].harta_kota
        if(condition == 'buy') {
            switch(yourCities) {
                // first time bought a city
                case '':
                    return `${cityName}-${cityProp}`
                // the next time bought a city
                default:
                    // split data to per city
                    const splitPerCity = yourCities.split(';') 
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
        else if(condition == 'sell') {
            // split data to per city
            const splitPerCity = yourCities.split(';') 
            // find city that player is gonna sell 
            const findPerCity = splitPerCity.map(v => {return v.includes(cityName)}).indexOf(true)
            if(findPerCity === -1) {
                feedbackTurnOn('kota yang ingin dijual tidak ditemukan')
                return feedbackTurnOff()
            }
            // remove the city
            splitPerCity.splice(findPerCity, 1)
            // return the cities back to string
            return splitPerCity.join(';')
        }
        else if(condition == 'disaster') {
            // split data to per city
            const splitPerCity = yourCities.split(';') 
            // find city that player is just bought 
            const findPerCity = splitPerCity.map(v => {return v.includes(cityName)}).indexOf(true)
            if(findPerCity === -1) {
                feedbackTurnOn('kota yang kena gempa tidak ditemukan')
                return feedbackTurnOff()
            }
            // remove the city prop
            splitPerCity[findPerCity] = splitPerCity[findPerCity].match(new RegExp(`.*(?=.${cityProp})`))
            // return the cities back to string
            return splitPerCity.join(';')
        }
    }
}

/**
 * @param {String} card the card name
 * @returns all cards once obtained or remove a card after use
 */
function manageCards(card, used = false) {
    const findYourCard = playersTurnObj.map(v => {return v.username}).indexOf(myGameData.username)
    if(findYourCard !== -1) {
        // get your cards
        const yourCards = playersTurnObj[findYourCard].kartu
        switch(yourCards) {
            // have 0 card
            case '':
                return card
            // have > 0 cards
            default:
                if(used === false) {
                    const splitPerCard = yourCards.split(';')
                    // indexOf(card) is possible cuz the map value is the same as card value
                    const findPerCard = splitPerCard.map(v => {return v}).indexOf(card)
                    // if you dont have the card yet, then push to array
                    if(findPerCard === -1) 
                        splitPerCard.push(card)
                    // return cards
                    return splitPerCard.join(';')
                }
                else if(used === true) {
                    // split data to per card
                    const splitPerCard = yourCities.split(';') 
                    // find card that player just used 
                    const findPerCard = splitPerCard.map(v => {return v}).indexOf(card)
                    if(findPerCard === -1) {
                        feedbackTurnOn('kartu yang ingin dihapus tidak ditemukan')
                        return feedbackTurnOff()
                    }
                    // removee the card
                    splitPerCard.splice(findPerCard, 1)
                    // return the cards back to string
                    return splitPerCard.join(';')
                }
        }
    }
}

/**
 * @param {Array} customArray 
 * @returns shuffled array values
 */
function shuffle(customArray) {
    let currentIndex = customArray.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [customArray[currentIndex], customArray[randomIndex]] = [customArray[randomIndex], customArray[currentIndex]];
    }
    return customArray;
}

/**
 * @event display message to feedback box
 */
function feedbackTurnOn(text) {
    qS('.feedback_box').style.opacity = 1;
    qS('.feedback_box').children[0].innerText += text + '\n';
    let timer = 10
    const startInterval = setInterval(() => {
        if(timer < 0) {
            clearInterval(startInterval)
            qS('.feedback_box').style.opacity = .3;
            qS('.feedback_box').children[0].innerText = "";
            return console.log('auto clean feedback on');
        }
        if(qS('.feedback_box').children[0].innerText == '') {
            clearInterval(startInterval)
            return console.log('auto clean feedback interrupted');
        }
        timer--
    }, 1000);
}

/**
 * @event set feedback box to its initial state after 3 seconds
 */
function feedbackTurnOff() {
    setTimeout(() => {
        qS('.feedback_box').style.opacity = .3;
        qS('.feedback_box').children[0].innerText = "";
    }, 3e3);
}

/**
 * an error notification with exclamation mark
 * @param {String} errorMessage - error message (string)
 */
function errorNotification(errorMessage) {
    feedbackTurnOn(`[${emoji.warning}] ${errorMessage}`)
}

function removeDialog(dialogWrapper, dialogContainer) {
    dialogWrapper.remove()
    dialogContainer.remove()
}

function inputFilter(inputValue, inputRegex) {
    if(inputValue.length >= 4 && inputValue.match(inputRegex))
        return true
    return false
}

function inputFilterError(inputElement, inputPlaceholder) {
    inputElement.placeholder = 'kelahi siko kaw gerot';
    if(inputElement.value.length <= 4)
        inputElement.placeholder = 'min. 4 karakter';
    inputElement.value = '';
    inputElement.style.border = '2px solid crimson';
    setTimeout(() => {
        inputElement.placeholder = inputPlaceholder;
        inputElement.style.border = '1px solid grey';
    }, 2000);
    return 
}

/**
 * @param {{status: Number, errorMessage: String}} err - error payload (object)
 */
function errorLogging(err) {
    const errorLog = qS('#errorLog')
    const errorContainer = cE('li')
    const errorMessage = (() => {
        let errMsg = null
        if(err.errorMessage) {
            if(typeof err.errorMessage == 'object')
                errMsg = `status: ${err.status}\n${err.errorMessage.message}`
            else
                errMsg = `status: ${err.status}\n${err.errorMessage}`
        }
        else 
            errMsg = err.message
        return errMsg
    })()
    errorContainer.innerText = errorMessage
    errorLog.insertBefore(errorContainer, errorLog.children[1])
}

function errorCapsule(err, errorMessage) {
    errorNotification(errorMessage)
    errorLogging(err)
    console.log(err);
}

function getGameStatus(fetching = true, gameStatus = null) {
    const gameStatusLamp = qS('#gameStatus')
    if(fetching) {
        fetcher(`/gamestatus`, 'GET')
        .then(result => {
            if(result.status == 200) {
                // state of the game, used to manage player join / spectator
                switch(result.data[0].status) {
                    case 'unready': 
                        gameStatusLamp.style.background = 'lightgrey'
                        break
                    case 'ready':
                        gameStatusLamp.style.background = 'yellow'
                        break
                    case 'playing':
                        gameStatusLamp.style.background = 'lawngreen'
                        break
                    case 'done':
                        gameStatusLamp.style.background = 'red'
                        break
                }
            }
            else if(result.status != 200) {
                return errorCapsule(result, anErrorOccured)
            }
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
    }
    // fetching == false, go straight here
    switch(gameStatus) {
        case 'unready':
            gameStatusLamp.style.background = 'lightgrey'
            break
        case 'ready':
            gameStatusLamp.style.background = 'yellow'
            break
        case 'playing':
            gameStatusLamp.style.background = 'lawngreen'
            break
        case 'done':
            gameStatusLamp.style.background = 'red'
            break
    }
}

function updateGameStatus(newGameStatus) {
    // update game status 
    fetcher(`/gamestatus`, 'PATCH', {gameStatus: newGameStatus})
    .then(result => {
        return fetcherResults(result, 'gameStatus')
    })
    .catch(err => {
        return errorCapsule(err, anErrorOccured)
    })
}

const resetter = {
    get resetGameStatus() {
        updateGameStatus('unready')
    },
    get resetPlayerTable() {
        fetcher('/deleteplayers', 'GET')
        .then(result => {
            if(result.status != 200) {
                return errorCapsule(result, anErrorOccured)
            }
            console.log(result);
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
    }
}

/**
 * @param {String} endpoint - api endpoint (string)
 * @param {String} method - http method GET/POST/PATCH/DELETE (string)
 * @param {{key: string|number}} jsonData - payload data (object)
 */
function fetcher(endpoint, method, jsonData) {
    // when user have uuid in localStorage, the user gonna run autoLogin to continue the game
    const requireUUID = getLocStorage('uuid') == null ? null : new URLSearchParams({ uuid: getLocStorage('uuid') })
    switch(method) {
        case 'GET':
            return fetch(`${url}/api${endpoint}?` + requireUUID, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(data => {return data.json()})
        case 'POST':
        case 'PATCH':
            return fetch(`${url}/api/${endpoint}?` + requireUUID, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            }).then(data => {return data.json()})
    }
}

/**
 * @param {{status:number,message:string,data:object}} result - payload from server (object)
 */
function fetcherResults(result, successResult = null) {
    if(result.status == 200 && successResult != null) {
        // check success result 
        switch(successResult) {
            case 'gameStatus':
                getGameStatus(false)
                break
            case 'register':
                registerHandler(result)
                break
            case 'login': 
                loginHandler(result)
                break
            case 'autoLogin':
                autoLoginHandler(result)
                break
            case 'logout':
                logoutHandler(result)
                break
            case 'gameResume':
                gameResume(result)
                break
        }
    }
    // if response status != 200, then display it to the screen
    else if(result.status != 200) {
        if(typeof result.errorMessage === 'object') {
            // error when player using the same username
            if(result.errorMessage.message?.match(/duplicate.key.value/)) {
                errorNotification(`username sudah dipakai\n`)
                qS('.acakGiliran').disabled = false;
                return feedbackTurnOff()
            }
            // other error
            else 
                return errorCapsule(result, anErrorOccured)
        }
        // error when data is null
        if(result.errorMessage.match(/cannot.be.null/)) {
            errorNotification(`randNumber/username null\n`)
            qS('.acakGiliran').disabled = false;
            return
        }
        // other error
        else {
            return errorCapsule(result, anErrorOccured)
        }
    }
    return console.log(result);
}
