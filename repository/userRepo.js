const { newPromise } = require('../helpers/basic')
const { selectAll, 
        selectOne, 
        insertDataRow, 
        updateData, 
        deleteAll } = require('../helpers/databaseQueries')

class UserRepo {
    registerRepo(req, res) {
        // TABLE = users
        const { uuid, username, password } = req.body
        // required data for query
        const queryObject = {}
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'users'},
            insertColumn: {enumerable: true, get: function() {
                return {
                    uuid: uuid,
                    username: username,
                    password: password
                } 
            }}
        })
        // insert user data  
        return newPromise(insertDataRow(req, res, queryObject))
    }

    loginRepo(req, res) {
        // TABLE = users
        const { username, password } = req.body
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
            whereValue_Two: {enumerable: true, value: password}
        })
        // get user data by username and password
        return newPromise(selectOne(req, res, queryObject))
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
        return newPromise(selectOne(req, res, queryObject))
    }

    logoutRepo(req, res) {

    }
}

module.exports = UserRepo