const qS = el => {return document.querySelector(el)}
const qSA = el => {return document.querySelectorAll(el)}
const cE = el => {return document.createElement(el)}
const docFrag = document.createDocumentFragment()

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
    qS('.feedback_box').children[0].innerText = text;
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
 * @param {String} errorMessage - error message (string)
 */
function errorNotification(errorMessage) {
    feedbackTurnOn(`[\u{2755}] ${errorMessage}`)
}

/**
 * @param {{status: Number, errorMessage: String}} err - error payload (object)
 */
function errorLogging(err) {
    const errorLog = qS('#errorLog')
    const errorContainer = cE('li')
    const errorMessage = (() => {
        let errMsg = null
        if(err.errorMessage != null) {
            if(typeof err.errorMessage == 'object')
                errMsg = `status: ${err.status}\n${JSON.stringify(err.errorMessage)}`
            else
                errMsg = `status: ${err.status}\n${err.errorMessage}`
        }
        else 
            errMsg = err.message
        return errMsg
    })()
    errorContainer.innerText = errorMessage
    errorLog.appendChild(errorContainer)
}

function errorCapsule(err, errorMessage) {
    errorNotification(errorMessage)
    errorLogging(err)
    console.log(err);
}

function getGameStatus(fetching = true) {
    const gameStatusLamp = qS('#gameStatus')
    if(fetching) {
        fetcher(`/api/gamestatus`, 'GET')
        .then(data => data.json())
        .then(result => {
            if(result.status == 200) {
                // console.log(result);
                gameStatus = result.data[0].status
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
            else if(result.status != 200) {
                return errorCapsule(result, `an error occured\n`)
            }
        })
        .catch(err => {
            return errorCapsule(err, `an error occured\n`)
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

const resetter = {
    get resetGameStatus() {
        fetcher(`/api/gamestatus`, 'PATCH', {gameStatus: 'unready'})
        .then(data => data.json())
        .then(result => {
            if(result.status == 200) {
                getGameStatus(false)
            }
            else if(result.status != 200) {
                return errorCapsule(result, `an error occured\n`)
            }
        })
        .catch(err => {
            return errorCapsule(err, `an error occured\n`)
        })
    },
    get resetPlayerTable() {
        fetcher('/api/deleteplayers', 'GET')
        .then(data => data.json())
        .then(result => {
            if(result.status != 200) {
                return errorCapsule(result, `an error occured\n`)
            }
            console.log(result);
        })
        .catch(err => {
            return errorCapsule(err, `an error occured\n`)
        })
    }
}

/**
 * @param {String} endpoint - api endpoint (string)
 * @param {String} method - http method get/post/etc (string)
 * @param {{key: string|number}|null} jsonData - payload data (object)
 */
function fetcher(endpoint, method, jsonData) {
    switch(method) {
        case 'GET':
            return fetch(`${url}${endpoint}?` + new URLSearchParams({ uuid: uuidv4() }), {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        case 'POST':
        case 'PATCH':
            return fetch(`${url}${endpoint}?` + new URLSearchParams({ uuid: uuidv4() }), {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
    }
}
