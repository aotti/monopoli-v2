const { newPromise } = require('../helpers/basic')
const { selectAll, 
        selectOne, 
        selectNewInsertedData, 
        insertDataRow, 
        insertDataCol,
        updateData, 
        deleteAll } = require('../helpers/databaseQueries')

class MonopoliRepo {
    getModsDataRepo(req, res) {
        // TABLE = mods
        // required data for query
        const queryObject = {
            table: 'mods',
            selectColumn: 'board_shape, money_start, money_lose, curse_min, curse_max, branch',
            whereColumn: 'id',
            whereValue: 1
        }
        // get mods data for board 
        return newPromise(selectOne(req, res, queryObject))
    }

    playerJoinedRepo(req, res) {
        // TABLE = prepare
        const {randNumber, username} = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepare'},
            insertColumn: {enumerable: true, get: function() {
                return {
                    player_joined: username,
                    player_forcing: false,
                    player_ready: false,
                    player_rand: randNumber
                } 
            }}
        })
        return newPromise(insertDataRow(req, res, queryObject))
        .then(() => {
            return newPromise(selectAll(req, res, queryObject))
        })
        .catch(err => {
            console.log('this.playerJoinedRepo');
            return console.log(err);
        })
    }

    forceStartRepo(req, res) {
        // TABLE = prepare
        const { username } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepare'},
            whereColumn: {enumerable: true, value: 'player_joined'},
            whereValue: {enumerable: true, value: username},
            updateColumn: {enumerable: true, get: function() {
                return {
                    player_forcing: true
                } 
            }}
        })
        return newPromise(updateData(req, res, queryObject))
        .then(() => {
            return newPromise(selectAll(req, res, queryObject))
        })
        .catch(err => {
            console.log('this.forceStartRepo');
            return console.log(err);
        })
    }

    readyRepo(req, res) {

    }
}

module.exports = MonopoliRepo