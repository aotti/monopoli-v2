function newPromise(data) {
    return new Promise((resolve, reject) => {
        data.then(result => {
            if(result.error != null)
                return reject(result.error)
            return resolve(result.data)
        })
    })
}

function newResponse(codeAndMessage, res, data) {
    if(typeof codeAndMessage === 'number')
        codeAndMessage = [codeAndMessage]
    switch(codeAndMessage[0]) {
        case 200:
            return res.status(codeAndMessage[0]).json({
                status: codeAndMessage[0],
                message: codeAndMessage[1],
                data: data
            })
        case 400: case 401: case 404: case 500:
            return res.status(codeAndMessage[0]).json({
                status: codeAndMessage[0],
                errorMessage: data
            })
    }
}

function isStringOrNumberOrBool(data, type) {
    if(typeof data === type)
        return false
    else if(typeof data !== type)
        return true
}

module.exports = {newPromise, newResponse, isStringOrNumberOrBool}