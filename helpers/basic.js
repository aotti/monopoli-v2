function newPromise(data) {
    return new Promise((resolve, reject) => {
        data.then(result => {
            // if cannot read properties of undefined (reading error) happen
            // it means the result is undefined
            if(result.error != null)
                return reject(result.error)
            return resolve(result.data)
        })
    })
}

function newResponse(codeAndMessage, res, data) {
    // if the status code type is number, change 
    // the codeAndMessage type to array to prevent error
    if(typeof codeAndMessage === 'number')
        codeAndMessage = [codeAndMessage]
    switch(codeAndMessage[0]) {
        case 200:
            return res.status(codeAndMessage[0]).json({
                status: codeAndMessage[0],
                message: codeAndMessage[1],
                data: data
            })
        case 400: case 401: case 403: case 404: case 500:
            const errorMessage = (() => {
                // error message container
                let errMsg = null
                // if errorMessage key exists
                if(data.errorMessage) {
                    // if inside errorMessage have another object
                    if(typeof data.errorMessage == 'object')
                        errMsg = `status: ${data.statusCode}\n${data.errorMessage.message}`
                    // only string message
                    else
                        errMsg = `status: ${data.statusCode}\n${data.errorMessage}`
                }
                // if message key exists
                else if(data.message) 
                    errMsg = data.message
                // no object in error
                else
                    errMsg = data
                return errMsg
            })()
            return res.status(codeAndMessage[0]).json({
                status: codeAndMessage[0],
                errorMessage: errorMessage
            })
    }
}

function catchResponse(res, err, logMessage) {
    console.log(logMessage);
    return newResponse(500, res, err)
}

function isVariableAppropriate(data, type) {
    if(typeof data === type)
        return false
    else if(typeof data !== type)
        return true
}

function isTheLengthAppropriate(data) {
    if(data.length < 4)
        return true 
    else if(data.length >= 4)
        return false
}

module.exports = {
    newPromise, 
    newResponse, 
    catchResponse,
    isVariableAppropriate, 
    isTheLengthAppropriate
}