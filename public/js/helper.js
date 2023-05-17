const qS = el => {return document.querySelector(el)}
const qSA = el => {return document.querySelectorAll(el)}
const cE = el => {return document.createElement(el)}
const docFrag = document.createDocumentFragment()

function setLocStorage(name, value) { return localStorage.setItem(name, value); }

function getLocStorage(name) { return localStorage.getItem(name) }

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
