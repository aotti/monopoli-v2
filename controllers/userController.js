// response manage
const { newResponse } = require('../helpers/basic')
// database manage
const userRepo = require('../repository/userRepo')
const UserRepo = new userRepo()

class User {
    register(req, res) {
        UserRepo.registerRepo(req, res)
        .then(result => {
            return newResponse([200, 'success register'], res, result)
        })
        .catch(err => {
            console.log('User.register');
            return newResponse(500, res, err)
        })
    }

    login(req, res) {
        UserRepo.loginRepo(req, res)
        .then(result => {
            if(result.length == 0)
                return newResponse(400, res, `username/password salah`)
            return newResponse([200, 'success login'], res, result)
        })
        .catch(err => {
            console.log('User.login');
            return newResponse(500, res, err)
        })
    }

    autoLogin(req, res) {
        UserRepo.autoLogin(req, res)
        .then(result => {
            if(result.length == 0)
                return newResponse(404, res, `user tidak ditemukan`)
            return newResponse([200, 'success autoLogin'], res, result)
        })
        .catch(err => {
            console.log('User.autoLogin');
            return newResponse(500, res, err)
        })
    }

    logout(req, res) {

    }
}

module.exports = User 