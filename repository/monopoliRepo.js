const { newPromise, newResponse, catchResponse } = require('../helpers/basic')
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
            // multiple where
            multipleWhere: false,
            whereColumn: 'id',
            whereValue: 1
        }
        // get status data for the game state
        return newPromise(selectOne(res, queryObject))
        .catch(err => catchResponse(res, err, 'Monopoli.getGameStatusRepo'))
    }

    updateGameStatusRepo(req, res) {
        // TABLE = games
        const { username, gameStatus } = req.body
        // required data for query
        const queryObject = {}
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'games'},
            selectColumn: {enumerable: true, value: 'status'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
            whereColumn: {enumerable: true, value: 'id'},
            whereValue: {enumerable: true, value: 1},
            updateColumn: {enumerable: true, get: function() {
                return {
                    status: gameStatus
                } 
            }}
        })
        if(username === 'dengkul' || username === 'system') {
            // update and get status data for the game state
            return newPromise(updateData(res, queryObject))
            .catch(err => catchResponse(res, err, 'Monopoli.updateGameStatusRepo 1'))
        }
        // find which player is trying to updateGameStatus 
        // if the player username != dengkul OR null, stop
        else {
            const preventUpdateGameStatus = new Promise((resolve, reject) => {
                resolve({data: {statusCode: 401, errorMessage: 'unauthorized', data: null}})
            })
            return newPromise(preventUpdateGameStatus)
        }
    }

    deletePlayerRowsRepo(req, res) {
        const { username } = req.body
        // required data for query
        const queryObject = {
            table: 'players',
            selectColumn: 'id, user_id(username)'
        }
        const  queryObject2 = {
            table: 'prepares',
            selectColumn: 'id, player_joined'
        }
        // find which player is trying to delete 
        // if the player username != dengkul, stop
        if(username !== 'dengkul') {
            const preventDeletePlayerRows = new Promise((resolve, reject) => {
                resolve({data: {statusCode: 401, errorMessage: 'unauthorized', data: null}})
            })
            return newPromise(preventDeletePlayerRows)
        }
        // delete all data from players
        return newPromise(deleteAll(res, queryObject))
        .then(() => {
            // delete all data from prepares
            return newPromise(deleteAll(res, queryObject2))
            .catch(err => catchResponse(res, err, 'Monopoli.deletePlayerRowsRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.deletePlayerRowsRepo 1'))
    }

    getModsDataRepo(req, res) {
        // TABLE = mods
        // required data for query
        const queryObject = {
            table: 'mods',
            selectColumn: 'board_shape, money_start, money_lose, curse_min, curse_max, branch',
            // multiple where
            multipleWhere: false,
            whereColumn: 'id',
            whereValue: 1
        }
        // get mods data for board 
        return newPromise(selectOne(res, queryObject))
        .catch(err => catchResponse(res, err, 'Monopoli.getModsDataRepo'))
    }

    changeModsDataRepo(req, res) {
        const { username, boardShape, moneyStart, moneyLose, curseMin, curseMax } = req.body
        // TABLE = mods
        // required data for query
        const queryObject = {
            table: 'mods',
            selectColumn: 'board_shape, money_start, money_lose, curse_min, curse_max, branch',
            // multiple where
            multipleWhere: false,
            whereColumn: 'id',
            whereValue: 1,
            get updateColumn() {
                return {
                    board_shape: boardShape,
                    money_start: moneyStart,
                    money_lose: moneyLose,
                    curse_min: curseMin,
                    curse_max: curseMax
                } 
            }
        }
        // if non admin player trying to change mods, return error
        if(username !== 'dengkul') {
            const preventChangeMods = new Promise((resolve, reject) => {
                resolve({data: {statusCode: 401, errorMessage: 'unauthorized', data: null}})
            })
            return newPromise(preventChangeMods)
        }
        // update and get mods data
        return newPromise(updateData(res, queryObject))
        .catch(err => catchResponse(res, err, 'Monopoli.changeModsDataRepo 1'))
    }

    getWaitingPlayersRepo(req, res) {
        // TABLE = prepares
        // required data for query
        const queryObject = {
            table: 'prepares',
            selectColumn: '*'
        }
        // get all waiting players data
        return newPromise(selectAll(res, queryObject))
        .then(resultAll => {
            const numberOfPlayers = resultAll.length
            // return only the number
            if(resultAll.length > 0) {
                // players count
                return { waitingPlayers: numberOfPlayers }
            }
            else if(resultAll.length === 0) {
                return { waitingPlayers: numberOfPlayers }
            }
        })
        .catch(err => catchResponse(res, err, 'Monopoli.getWaitingPlayersRepo 1'))
    }

    playerJoinedRepo(req, res) {
        // TABLE = prepares
        const {randNumber, username} = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepares'},
            selectColumn: {enumerable: true, value: 'player_joined, player_forcing, player_ready, player_rand'},
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
        return newPromise(insertDataRow(res, queryObject))
        .then(() => {
            // get all player data who joined
            return newPromise(selectAll(res, queryObject))
            .catch(err => catchResponse(res, err, 'Monopoli.playerJoinedRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.playerJoinedRepo 1'))
    }

    forceStartRepo(req, res) {
        // TABLE = prepares
        const { username } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepares'},
            selectColumn: {enumerable: true, value: 'player_joined, player_forcing, player_ready, player_rand'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
            whereColumn: {enumerable: true, value: 'player_joined'},
            whereValue: {enumerable: true, value: username},
            updateColumn: {enumerable: true, get: function() {
                return {
                    player_forcing: true
                } 
            }}
        })
        // update player_forcing: true
        return newPromise(updateData(res, queryObject))
        .then(() => {
            // get all player data
            return newPromise(selectAll(res, queryObject))
            .catch(err => catchResponse(res, err, 'Monopoli.forceStartRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.forceStartRepo 1'))
    }

    readyRepo(req, res) {
        // TABLE = prepares
        const { user_id, username, pos, harta_uang, harta_kota, kartu, giliran, jalan, penjara, putaran } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'prepares'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
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
            selectColumn: {enumerable: true, value: 'user_id(id, username), pos, harta_uang, harta_kota, kartu, giliran, jalan, penjara, putaran'},
            insertColumn: {enumerable: true, get: function() {
                return {
                    user_id: user_id,
                    pos: pos,
                    harta_uang: harta_uang,
                    harta_kota: harta_kota,
                    kartu: kartu,
                    giliran: giliran,
                    jalan: jalan,
                    penjara: penjara,
                    putaran: putaran
                } 
            }}
        })
        // update player_ready: true
        return newPromise(updateData(res, queryObject))
        .then(() => {
            // insert data to players table
            return newPromise(insertDataRow(res, queryObject2))
            .then(() => {
                // get all player data from players table
                return newPromise(selectAll(res, queryObject2))
                .catch(err => catchResponse(res, err, 'Monopoli.readyRepo 3'))
            })
            .catch(err => catchResponse(res, err, 'Monopoli.readyRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.readyRepo 1'))
    }

    playerMovingRepo(req, res) {
        // TABLE = prepares
        const { user_id } = req.body
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'players'},
            selectColumn: {enumerable: true, value: 'user_id(username), harta_uang, harta_kota, giliran, putaran, penjara'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
            whereColumn: {enumerable: true, value: 'user_id'},
            whereValue: {enumerable: true, value: user_id}
        })
        // get player data that is moving
        return newPromise(selectOne(res, queryObject))
        .then(result => {
            if(result.length == 0)
                return newResponse(404, res, `player tidak ditemukan`)
            return result
        })
        .catch(err => catchResponse(res, err, 'Monopoli.playerMovingRepo'))
    }

    playerTurnEndRepo(req, res) {
        // TABLE = players
        const { 
            money_lose_mods,
            user_id, pos, 
            harta_uang, harta_kota, 
            kartu, jalan, 
            penjara, putaran, 
            next_player, lost_players, 
            tax_payment 
        } = req.body
        // temp harta_kota value to anticipate if current player is losing
        let hartaKotaFiltered = harta_kota
        // check if current end player is losing or not
        if(harta_uang < -money_lose_mods) {
            hartaKotaFiltered = ''
        }
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'players'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
            whereColumn: {enumerable: true, value: 'user_id'},
            whereValue: {enumerable: true, value: user_id},
            updateColumn: {enumerable: true, get: function() {
                return {
                    pos: pos,
                    harta_uang: harta_uang,
                    harta_kota: hartaKotaFiltered,
                    kartu: kartu,
                    jalan: jalan,
                    penjara: penjara,
                    putaran: putaran
                } 
            }}
        })
        const queryObject2 = {}
        Object.defineProperties(queryObject2, {
            table: {enumerable: true, value: 'players'},
            selectColumn: {enumerable: true, value: 'user_id(id, username), pos, giliran, harta_uang, harta_kota, kartu'},
            // multiple where
            multipleWhere: {enumerable: true, value: false},
            whereColumn: {enumerable: true, value: 'user_id'},
            whereValue: {enumerable: true, value: next_player},
            updateColumn: {enumerable: true, get: function() {
                return {
                    jalan: true
                } 
            }}
        })
        // if tax payment exist
        if(tax_payment) {
            const queryObject3 = {}
            Object.defineProperties(queryObject3, {
                table: {enumerable: true, value: 'players'},
                // multiple where
                multipleWhere: {enumerable: true, value: false},
                whereColumn: {enumerable: true, value: 'user_id'},
                whereValue: {enumerable: true, value: tax_payment.target_owner},
                updateColumn: {enumerable: true, get: function() {
                    return {
                        harta_uang: tax_payment.target_money
                    } 
                }}
            })
            // update player data whom gets money from taxes
            newPromise(updateData(res, queryObject3))
            .catch(err => catchResponse(res, err, 'Monopoli.playerTurnEndRepo 4'))
        }
        else if(lost_players) {
            // loser = user_id
            for(let loser of lost_players) {
                // required data
                const queryObject4 = {
                    table: 'players',
                    selectColumn: '*',
                    multipleWhere: false,
                    whereColumn: 'user_id',
                    whereValue: loser,
                    get updateColumn() {
                        return {
                            harta_kota: ''
                        }
                    }
                }
                // update harta_kota for losers
                newPromise(updateData(res, queryObject4))
                .catch(err => catchResponse(res, err, 'Monopoli.playerTurnEndRepo 5'))
            }
        }
        // update current player data
        return newPromise(updateData(res, queryObject))
        .then(() => {
            // update next player jalan to TRUE
            return newPromise(updateData(res, queryObject2))
            .then(resultOne => {
                // get only next player data from players table
                if(resultOne.length == 0)
                    return  newResponse(404, res, 'user(one) tidak ditemukan')
                // get other player data from players table
                return newPromise(selectAll(res, queryObject2))
                .then(resultAll => {
                    if(resultAll.length == 0)
                        return  newResponse(404, res, 'user(all) tidak ditemukan')
                    return [{ nextPlayerData: resultOne, otherPlayerData: resultAll }]
                })
                .catch(err => catchResponse(res, err, 'Monopoli.playerTurnEndRepo 3'))
            })
            .catch(err => catchResponse(res, err, 'Monopoli.playerTurnEndRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.playerTurnEndRepo 1'))
    }

    gameResumeRepo(req, res) {
        // TABLE = players
        const queryObject = {}
        // required data for query
        Object.defineProperties(queryObject, {
            table: {enumerable: true, value: 'players'},
            selectColumn: {enumerable: true, value: 'user_id(id, username), pos, harta_uang, harta_kota, kartu, giliran, jalan, penjara, putaran'}
        })
        // get all players 
        return newPromise(selectAll(res, queryObject))
        .catch(err => catchResponse(res, err, 'Monopoli.gameResumeRepo'))
    }
}

module.exports = MonopoliRepo