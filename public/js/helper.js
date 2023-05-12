const qS = el => {return document.querySelector(el)}
const qSA = el => {return document.querySelectorAll(el)}
const cE = el => {return document.createElement(el)}
const docFrag = document.createDocumentFragment()

function feedbackTurnOff() {
    setTimeout(() => {
        qS('.feedback_box').style.opacity = .3;
        qS('.feedback_box').children[0].innerText = "";
    }, 3e3);
}

/**
 * @param {String} apiUrl - base url + api endpoint (string)
 * @param {String} method - http method get/post/etc (string)
 * @param {{key: string|number}|null} jsonData - payload data (object)
 */
function fetcher(apiUrl, method, jsonData, userUUID) {
    if(jsonData == null) {
        return fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'userUUID'
            }
        })
    }
    else {
        return fetch(apiUrl, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-Custom-Header': 'userUUID'
            },
            body: JSON.stringify(jsonData)
        })
    }
}

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}