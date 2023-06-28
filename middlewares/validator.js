const { newResponse, isVariableAppropriate, isTheLengthAppropriate } = require('../helpers/basic')
const stringType = 'string'
const numberType = 'number'
const booleanType = 'boolean'
const objectType = 'object'
const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

function validatePlayerJoined(req, res, next) {
    const { randNumber, username } = req.body
    // check var types
    switch(true) {
        case randNumber == null || username == null:
            return newResponse(400, res, 'randNumber/username cannot be null')
        case isVariableAppropriate(randNumber, numberType):
        case isVariableAppropriate(username, stringType):
            return newResponse(400, res, 'randNumber/username type is invalid')
    }
    next()
}

function validatePlayerForcing(req, res, next) {
    const { username } = req.body
    // check var types
    switch(true) {
        case username == null:
            return newResponse(400, res, 'playerForcing cannot be null')
        case isVariableAppropriate(username, stringType):
            return newResponse(400, res, 'playerForcing type is invalid')
    }
    next()
}

function validatePlayerData(req, res, next) {
    const { user_id, username, pos, harta_uang, harta_kota, kartu, giliran, jalan, penjara, next_player } = req.body
    // check var exists
    switch(true) {
        case next_player && isVariableAppropriate(next_player, numberType):
        case giliran && isVariableAppropriate(giliran, numberType):
        case username && isVariableAppropriate(username, stringType):
            return newResponse(400, res, 'player exist is invalid')
    }
    // check var types
    switch(true) {
        case isVariableAppropriate(user_id, numberType):
        case isVariableAppropriate(pos, stringType):
        case isVariableAppropriate(harta_uang, numberType):
        case isVariableAppropriate(harta_kota, stringType):
        case isVariableAppropriate(kartu, stringType):
        case isVariableAppropriate(jalan, booleanType):
        case isVariableAppropriate(penjara, booleanType):
            return newResponse(400, res, 'player type is invalid')
    }
    next()
}

function validateRegisterLogin(req, res, next) {
    const { uuid, username, password } = req.body
    let action = 'login'
    if(uuid != null) {
        action = 'registration'
        if(uuidv4Regex.test(uuid) === false)
            return newResponse(400, res, `Invalid ${action} data`)
    }
    switch(true) {
        // check var length
        case isTheLengthAppropriate(username):
        case isTheLengthAppropriate(password):
            return newResponse(400, res, `Invalid data length`)
        // check var type
        case isVariableAppropriate(username, stringType):
        case isVariableAppropriate(password, stringType):
            return newResponse(400, res, `Invalid ${action} data`)
    }
    next()
}

function validateUUIDv4(req, res, next) {
    const { uuid } = req.query
    // check if UUID is version 4
    if(uuidv4Regex.test(uuid))
        return next()
    return newResponse(400, res, 'Invalid UUID')
}

module.exports = {
    validateUUIDv4, 
    validatePlayerJoined, 
    validatePlayerForcing, 
    validatePlayerData,
    validateRegisterLogin
}