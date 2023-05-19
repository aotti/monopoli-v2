const { newResponse, isStringOrNumber } = require('../helpers/basic')
const stringType = 'string'
const numberType = 'number'

function validatePlayerJoined(req, res, next) {
    const { randNumber, username } = req.body
    // if(randNumber == null || username == null) 
    //     return newResponse(400, res, 'player joined cannot be null')
    // check var types
    switch(true) {
        case randNumber == null || username == null :
            return newResponse(400, res, 'randNumber/username cannot be null')
        case isStringOrNumber(randNumber, numberType) :
        case isStringOrNumber(username, stringType) :
            return newResponse(400, res, 'randNumber/username is invalid')
    }
    next()
}

function validatePlayerForcing(req, res, next) {
    const { username } = req.body
    if(username == null) 
        return newResponse(400, res, 'player forcing cannot be null')
    next()
}

function validateUUIDv4(req, res, next) {
    const {uuid} = req.query
    // check if UUID is version 4
    if(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(uuid))
        return next()
    else 
        return newResponse(401, res, 'unauthorized')
}

module.exports = {validateUUIDv4, validatePlayerJoined, validatePlayerForcing}