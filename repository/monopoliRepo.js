const { newPromise } = require('../helpers/basic')
const { selectAll, 
        selectOne, 
        insertDataRow, 
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

    deletePlayerRowsRepo(req, res) {
        // TABLE = players, prepares
        // required data for query
        const queryObject = {
            table: 'players'
        }
        const  queryObject2 = {
            table: 'prepares'
        }
        // delete all data from players
        return newPromise(deleteAll(req, res, queryObject))
        .then(() => {
            // delete all data from prepares
            return newPromise(deleteAll(req, res, queryObject2))
        })
        .catch(err => {
            console.log('this.deletePlayerRowsRepo');
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
        // insert player data when joined 
        return newPromise(insertDataRow(req, res, queryObject))
        .then(() => {
            // get all player data who joined
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
        const { username, pos, harta_uang, harta_kota, kartu, giliran, jalan, penjara } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
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
                    pos: pos,
                    harta_uang: harta_uang,
                    harta_kota: harta_kota,
                    kartu: kartu,
                    giliran: giliran,
                    jalan: jalan,
                    penjara: penjara
                } 
            }}
        })
        // update player_ready: true
        return newPromise(updateData(req, res, queryObject))
        .then(() => {
            // insert data to players table
            return newPromise(insertDataRow(req, res, queryObject2))
            .then(() => {
                // get all player data from players table
                return newPromise(selectAll(req, res, queryObject2))
            })
            .catch(err => {
                console.log('this.readyRepo 2');
                return console.log(err);
            })
        })
        .catch(err => {
            console.log('this.readyRepo 1');
            return console.log(err);
        })
    }

    playerTurnEndRepo(req, res) {
        // TABLE = players
        const { username, pos, harta_uang, harta_kota, kartu, jalan, penjara, next_player } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'players'},
            selectColumn: {enumerable: true, value: 'username, pos, harta_uang, harta_kota, kartu, jalan, penjara'},
            whereColumn: {enumerable: true, value: 'username'},
            whereValue: {enumerable: true, value: username},
            updateColumn: {enumerable: true, get: function() {
                return {
                    pos: pos,
                    harta_uang: harta_uang,
                    harta_kota: harta_kota,
                    kartu: kartu,
                    jalan: jalan,
                    penjara: penjara
                } 
            }}
        })
        const queryObject2 = {}
        Object.defineProperties(queryObject2, {
            table: {enumerable: true, value: 'players'},
            selectColumn: {enumerable: true, value: 'username, pos, giliran, jalan'},
            whereColumn: {enumerable: true, value: 'username'},
            whereValue: {enumerable: true, value: next_player},
            updateColumn: {enumerable: true, get: function() {
                return {
                    jalan: true
                } 
            }}
        })
        // update player data
        return newPromise(updateData(req, res, queryObject))
        .then(() => {
            // update next player jalan to TRUE
            return newPromise(updateData(req, res, queryObject2))
            .then(() => {
                // get only next player data from players table
                return newPromise(selectOne(req, res, queryObject2))
            })
            .catch(err => {
                console.log('this.playerTurnEndRepo 2');
                return console.log(err);
            })
        })
        .catch(err => {
            console.log('this.playerTurnEndRepo 1');
            return console.log(err);
        })
    }
}

module.exports = MonopoliRepo