const { newResponse, isVariableAppropriate, isTheLengthAppropriate } = require('../helpers/basic')
const stringType = 'string'
const numberType = 'number'
const booleanType = 'boolean'
const objectType = 'object'
const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

// ### GABUNG VALIDATOR JOINED & FORCING
// ### GABUNG VALIDATOR JOINED & FORCING
// validate players after click 'kocok giliran'
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

// validate players after click 'paksa mulai'
function validatePlayerForcing(req, res, next) {
    const { username } = req.body
    // check var types
    switch(true) {
        case username == null:
            return newResponse(400, res, 'validate playerForcing cannot be null')
        case isVariableAppropriate(username, stringType):
            return newResponse(400, res, 'validate playerForcing type is invalid')
    }
    next()
}

// validate players when starting the game and ending their turn
function validatePlayerData(req, res, next) {
    const { 
        money_lose_mods,
        user_id, username, 
        pos, harta_uang, 
        harta_kota, kartu, 
        giliran, jalan, 
        penjara, putaran, 
        transfer, sell_city,
        next_player, lost_players, 
        tax_payment 
    } = req.body
    // check var exists and types 
    // null value wont be checked
    switch(true) {
        case money_lose_mods && isVariableAppropriate(money_lose_mods, numberType):
        case username && isVariableAppropriate(username, stringType):
        case giliran && isVariableAppropriate(giliran, numberType):
        case next_player && isVariableAppropriate(next_player, numberType):
        case lost_players && isVariableAppropriate(lost_players, objectType):
        case tax_payment && isVariableAppropriate(tax_payment, objectType):
            return newResponse(400, res, 'validate player exist is invalid')
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
        case isVariableAppropriate(putaran, numberType):
        case isVariableAppropriate(transfer, booleanType):
        case isVariableAppropriate(sell_city, booleanType):
            return newResponse(400, res, 'validate player type is invalid')
    }
    next()
}

// validate players when register/login
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

// validate players when sell/upgrade city
function validateCityChanges(req, res, next) {
    const { user_id, 
        city_for_sale, cities_after_sale, money_after_sale, sell_city,
        city_for_upgrade, cities_after_upgrade, money_after_upgrade, cards_after_upgrade } = req.body
    switch(true) {
        case isVariableAppropriate(user_id, numberType):
        // check if exist
        // null value wont be checked
        // city
        case city_for_sale && isVariableAppropriate(city_for_sale, stringType):
        case cities_after_sale && isVariableAppropriate(cities_after_sale, stringType):
        case money_after_sale && isVariableAppropriate(money_after_sale, numberType):
        case sell_city && isVariableAppropriate(sell_city, booleanType):
        // upgrade
        case city_for_upgrade && isVariableAppropriate(city_for_upgrade, stringType):
        case cities_after_upgrade && isVariableAppropriate(cities_after_upgrade, stringType):
        case money_after_upgrade && isVariableAppropriate(money_after_upgrade, numberType):
        case cards_after_upgrade && isVariableAppropriate(cards_after_upgrade, stringType):
            return newResponse(400, res, 'validate city changes type doesnt exist/invalid')
    }
    next()
}

function validateSurrender(req, res, next) {
    const { user_id, harta_uang, harta_kota, kartu } = req.body
    switch(true) {
        case isVariableAppropriate(user_id, numberType):
        case isVariableAppropriate(harta_uang, numberType):
        case isVariableAppropriate(harta_kota, stringType):
        case isVariableAppropriate(kartu, stringType):
            return newResponse(400, res, 'validate surrender type invalid')
    }
    next()
}

// validate UUID version
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
    validateRegisterLogin,
    validateCityChanges,
    validateSurrender
}