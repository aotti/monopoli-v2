function newPromise(data) {
    return new Promise((resolve, reject) => {
        data.then(result => {
            if(result.error != null)
                return reject(result.error)
            return resolve(result.data)
        })
    })
}

function newResponse(type, res, data) {
    switch(type) {
        case 200:
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: data
            })
        case 400:
            return res.status(400).json({
                status: 400,
                errorMessage: data
            })
        case 401:
            return res.status(401).json({
                status: 401,
                errorMessage: data
            })
        case 500:
            return res.status(500).json({
                status: 500,
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