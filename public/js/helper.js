const qS = el => {return document.querySelector(el)}
const qSA = el => {return document.querySelectorAll(el)}
const cE = el => {return document.createElement(el)}
const docFrag = document.createDocumentFragment()

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
    qS('.feedback_box').style.opacity = 1;
    qS('.feedback_box').children[0].innerText = `[\u{2755}] ${errorMessage}`;
}

/**
 * @param {{status: Number, errorMessage: String}} err - error payload (object)
 */
function errorLogging(err) {
    const errorLog = qS('#errorLog')
    const errorContainer = cE('li')
    const errorMessage = `status: ${err.status}\n${JSON.stringify(err.errorMessage)}`
    errorContainer.innerText = errorMessage
    errorLog.appendChild(errorContainer)
}

/**
 * @param {String} apiUrl - base url + api endpoint (string)
 * @param {String} method - http method get/post/etc (string)
 * @param {{key: string|number}|null} jsonData - payload data (object)
 */
function fetcher(apiUrl, method, jsonData) {
    if(jsonData == null) {
        return fetch(`${apiUrl}?` + new URLSearchParams({ uuid: pubnub.getUUID() }), {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
    else {
        return fetch(`${apiUrl}?` + new URLSearchParams({ uuid: pubnub.getUUID() }), {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
    }
}
