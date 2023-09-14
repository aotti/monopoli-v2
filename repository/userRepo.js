const { newPromise, newResponse, catchResponse } = require('../helpers/basic')
const { selectAll, 
        selectOne, 
        insertDataRow, 
        updateData, 
        deleteAll } = require('../helpers/databaseQueries')

class UserRepo {
    registerRepo(req, res) {
        // TABLE = users
        const { uuid, username, password, status } = req.body
        // required data for query
        const queryObject = {}
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'users'},
            selectColumn: {enumerable: true, value: 'username'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
            whereColumn: {enumerable: true, value: 'uuid'},
            whereValue: {enumerable: true, value: uuid},
            insertColumn: {enumerable: true, get: function() {
                return {
                    uuid: uuid,
                    username: username,
                    password: password,
                    status: status
                } 
            }}
        })
        // insert user data  
        return newPromise(insertDataRow(res, queryObject))
        .then(() => {
            // get the inserted data
            return newPromise(selectOne(res, queryObject))
            // error on selectOne
            .catch(err => catchResponse(res, err, 'User.registerRepo 2'))
        })
        // error on insertDataRow
        .catch(err => catchResponse(res, err, 'User.registerRepo 1'))
    }

    loginRepo(req, res) {
        // TABLE = users
        const { username, password, status } = req.body
        // required data for query
        const queryObject = {}
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'users'},
            selectColumn: {enumerable: true, value: 'id, uuid, username'},
            multipleWhere: {enumerable: true, value: true},
            // where 1
            whereColumn_One: {enumerable: true, value: 'username'},
            whereValue_One: {enumerable: true, value: username},
            // where 2
            whereColumn_Two: {enumerable: true, value: 'password'},
            whereValue_Two: {enumerable: true, value: password},
            updateColumn: {enumerable: true, get: function() {
                return {
                    status: status
                } 
            }}
        })
        // get user data by username and password
        return newPromise(selectOne(res, queryObject))
        .then(user => {
            // if user data doesnt match with the database
            if(user.length == 0)
                return newResponse(400, res, `username/password salah`)
            // get the updated data
            return newPromise(updateData(res, queryObject))
            .then(() => {
                // get user data after update
                return newPromise(selectOne(res, queryObject))
                // error on selectOne
                .catch(err => catchResponse(res, err, 'User.loginRepo 3'))
            })
            // error on updateData
            .catch(err => catchResponse(res, err, 'User.loginRepo 2'))
        })
        // error on selectOne
        .catch(err => catchResponse(res, err, 'User.loginRepo 1'))
    }

    autoLogin(req, res) {
        // TABLE = users
        const { uuid } = req.query
        // required data for query
        const queryObject = {}
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'users'},
            selectColumn: {enumerable: true, value: 'id, uuid, username'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
            whereColumn: {enumerable: true, value: 'uuid'},
            whereValue: {enumerable: true, value: uuid}
        })
        // get user data by username and password
        return newPromise(selectOne(res, queryObject))
        .then(result => {
            // if user data doesnt match with the database
            if(result.length == 0)
                return newResponse(404, res, `user tidak ditemukan`)
            // if user found, return promise result
            return result
        })
        // error on selectOne
        .catch(err => catchResponse(res, err, 'User.autoLogin'))
    }

    logoutRepo(req, res) {
        // TABLE = users
        const { uuid } = req.query
        const { status } = req.body
        // required data for query
        const queryObject = {}
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'users'},
            selectColumn: {enumerable: true, value: 'username, status'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
            whereColumn: {enumerable: true, value: 'uuid'},
            whereValue: {enumerable: true, value: uuid},
            updateColumn: {enumerable: true, get: function() {
                return {
                    status: status
                } 
            }}
        })
        // get user data by username and password
        return newPromise(selectOne(res, queryObject))
        .then(result => {
            // if the user trying to logout but not even login
            if(result[0].status == 'logout') 
                return newResponse(403, res, 'Apapula belum login uda logout..')
            // if someone trying to logout but theres no data matched
            else if(result.length == 0)
                return newResponse(404, res, `Anda ini hekel darimana?`)
            // when theres no more error, update user status
            return newPromise(updateData(res, queryObject))
            .then(() => {
                // get data after successful logout
                return newPromise(selectOne(res, queryObject))
                // error on selectOne
                .catch(err => catchResponse(res, err, 'User.logoutRepo 3'))
            })
            // error on updateData
            .catch(err => catchResponse(res, err, 'User.logoutRepo 2'))
        })
        // error on selectOne
        .catch(err => catchResponse(res, err, 'User.logoutRepo 1'))
    }
}

module.exports = UserRepo