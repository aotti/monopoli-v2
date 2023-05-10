const { newResponse } = require('../helpers/response')

function validatePlayerJoined(req, res, next) {
    const { randNumber, username } = req.body
    if(randNumber == null || username == null) {
        return newResponse(400, res, 'player joined cannot be null')
    }
    next()
}

module.exports = {validatePlayerJoined}