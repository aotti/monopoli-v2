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
