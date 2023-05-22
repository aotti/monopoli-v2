const { newPromise } = require('../helpers/basic')
const { selectAll, 
        selectOne, 
        selectNewInsertedData, 
        insertDataRow, 
        insertDataCol,
        updateData, 
        deleteAll } = require('../helpers/databaseQueries')

class MonopoliRepo {
    getGameStatusRepo(req, res) {
        // TABLE = games
        // required data for query
        const queryObject = {
            table: 'games',
            selectColumn: 'status',
            whereColumn: 'id',
            whereValue: 1
        }
        // get status data for the game state
        return newPromise(selectOne(req, res, queryObject))
    }

    updateGameStatusRepo(req, res) {
        // TABLE = games
        const { gameStatus } = req.body
        // required data for query
        const queryObject = {}
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'games'},
            whereColumn: {enumerable: true, value: 'id'},
            whereValue: {enumerable: true, value: 1},
            updateColumn: {enumerable: true, get: function() {
                return {
                    status: gameStatus
                } 
            }}
        })
        // get status data for the game state
        return newPromise(updateData(req, res, queryObject))
        .then(() => {
            // get all player data
            return newPromise(selectAll(req, res, queryObject))
        })
        .catch(err => {
            console.log('this.updateGameStatusRepo');
            return console.log(err);
        })
    }

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
        // TABLE = prepares
        const {randNumber, username} = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepares'},
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
        // TABLE = prepares
        const { username } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepares'},
            whereColumn: {enumerable: true, value: 'player_joined'},
            whereValue: {enumerable: true, value: username},
            updateColumn: {enumerable: true, get: function() {
                return {
                    player_forcing: true
                } 
            }}
        })
        // update player_forcing: true
        return newPromise(updateData(req, res, queryObject))
        .then(() => {
            // get all player data
            return newPromise(selectAll(req, res, queryObject))
        })
        .catch(err => {
            console.log('this.forceStartRepo');
            return console.log(err);
        })
    }

    readyRepo(req, res) {
        // TABLE = prepares
        const { username, harta, pos, kartu, giliran, penjara } = req.body
        const queryObject1 = {}
        // required data for query
        Object.defineProperties(queryObject1, {
            table: {enumerable: true, value: 'prepares'},
            whereColumn: {enumerable: true, value: 'player_joined'},
            whereValue: {enumerable: true, value: username},
            updateColumn: {enumerable: true, get: function() {
                return {
                    player_ready: true
                } 
            }}
        })
        // TABLE = players
        const queryObject2 = {}
        // required data for query
        Object.defineProperties(queryObject2, {
            table: {enumerable: true, value: 'players'},
            insertColumn: {enumerable: true, get: function() {
                return {
                    username: username,
                    harta: harta,
                    pos: pos,
                    kartu: kartu,
                    giliran: giliran,
                    penjara: penjara
                } 
            }}
        })
        // update player_ready: true
        return newPromise(updateData(req, res, queryObject1))
        .then(() => {
            // insert data to players table
            return newPromise(insertDataRow(req, res, queryObject2))
            .then(() => {
                // get all player data
                return newPromise(selectAll(req, res, queryObject1))
            })
            .catch(err => {
                console.log('this.readyRepo');
                return console.log(err);
            })
        })
        .catch(err => {
            console.log('this.readyRepo');
            return console.log(err);
        })
    }

    playerTurnEndRepo(req, res) {
        // TABLE = players
        const { username, harta, pos, kartu, giliran, penjara } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'players'},
            whereColumn: {enumerable: true, value: 'username'},
            whereValue: {enumerable: true, value: username},
            updateColumn: {enumerable: true, get: function() {
                return {
                    harta: harta,
                    pos: pos,
                    kartu: kartu,
                    giliran: giliran,
                    penjara: penjara
                } 
            }}
        })
        // update player_forcing: true
        return newPromise(updateData(req, res, queryObject))
        .then(() => {
            // get all player data
            return newPromise(selectAll(req, res, queryObject))
        })
        .catch(err => {
            console.log('this.playerTurnEndRepo');
            return console.log(err);
        })
    }
}

module.exports = MonopoliRepo