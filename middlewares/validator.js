const { newResponse } = require('../helpers/response')

function validatePlayerJoined(req, res, next) {
    const { randNumber, username } = req.body
    if(randNumber == null || username == null) {
        return newResponse(400, res, 'player joined cannot be null')
    }
    next()
}

function validateUUIDv4(req, res, next) {
    console.log(`header: ${req.headers['X-Custom-Header']}`);
    const uuid = req.headers
    if(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuid))
        return next()
    else 
        return newResponse(401, res, 'unauthorized')
}

module.exports = {validatePlayerJoined, validateUUIDv4}