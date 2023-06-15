// response manage
const { newResponse } = require('../helpers/basic')
// database manage
const userRepo = require('../repository/userRepo')
const UserRepo = new userRepo()

class User {
    register(req, res) {
        UserRepo.registerRepo(req, res)
        .then(result => {
            // insert data
            if(result.length > 0)
                return newResponse([200, 'success register'], res, result)
            if(result.statusCode != 200) return
        })
    }

    login(req, res) {
        UserRepo.loginRepo(req, res)
        .then(result => {
            // update data
            if(result.length > 0)
                return newResponse([200, 'success login'], res, result)
            if(result.statusCode != 200) return
        })
    }

    autoLogin(req, res) {
        UserRepo.autoLogin(req, res)
        .then(result => {
            // select data
            if(result.length > 0)
                return newResponse([200, 'success autoLogin'], res, result)
            if(result.statusCode != 200) return
        })
    }

    logout(req, res) {
        UserRepo.logoutRepo(req, res)
        .then(result => {
            // update data
            if(result.length > 0)
                return newResponse([200, 'success logout'], res, result)
            if(result.statusCode != 200) return
        })
    }
}

module.exports = User 