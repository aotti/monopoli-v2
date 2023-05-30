const { newResponse, isStringOrNumberOrBool } = require('../helpers/basic')
const stringType = 'string'
const numberType = 'number'
const booleanType = 'boolean'

function validatePlayerJoined(req, res, next) {
    const { randNumber, username } = req.body
    // check var types
    switch(true) {
        case randNumber == null || username == null :
            return newResponse(400, res, 'randNumber/username cannot be null')
        case isStringOrNumberOrBool(randNumber, numberType) :
        case isStringOrNumberOrBool(username, stringType) :
            return newResponse(400, res, 'randNumber/username type is invalid')
    }
    next()
}

function validatePlayerForcing(req, res, next) {
    const { username } = req.body
    // check var types
    switch(true) {
        case username == null :
            return newResponse(400, res, 'playerForcing cannot be null')
        case isStringOrNumberOrBool(username, stringType) :
            return newResponse(400, res, 'playerForcing type is invalid')
    }
    next()
}

function validatePlayerData(req, res, next) {
    const { username, pos, harta_uang, harta_kota, kartu, giliran, jalan, penjara, next_player } = req.body
    // check var types
    if(next_player != null) {
        if(isStringOrNumberOrBool(next_player, stringType) == true)
            return newResponse(400, res, 'player type is invalid')
    }
    switch(true) {
        case isStringOrNumberOrBool(username, stringType) :
        case isStringOrNumberOrBool(pos, stringType) :
        case isStringOrNumberOrBool(harta_uang, numberType) :
        case isStringOrNumberOrBool(harta_kota, stringType) :
        case isStringOrNumberOrBool(kartu, stringType) :
        case isStringOrNumberOrBool(giliran, numberType) :
        case isStringOrNumberOrBool(jalan, booleanType) :
        case isStringOrNumberOrBool(penjara, booleanType) :
            return newResponse(400, res, 'player type is invalid')
    }
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

module.exports = {
    validateUUIDv4, 
    validatePlayerJoined, 
    validatePlayerForcing, 
    validatePlayerData
}