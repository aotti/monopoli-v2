// response manage
const { newResponse } = require('../helpers/basic')
// database manage
const userRepo = require('../repository/userRepo')
const UserRepo = new userRepo()

class User {
    register(req, res) {
        UserRepo.registerRepo(req, res)
        .then(result => {
            return newResponse(200, res, 'register complete')
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    login(req, res) {
        UserRepo.loginRepo(req, res)
        .then(result => {
            if(result.length == 0)
                return newResponse(400, res, `username/password salah`)
            return newResponse(200, res, result)
        })
        .catch(err => {return newResponse(500, res, err)})
    }

    logout(req, res) {

    }
}

module.exports = User 