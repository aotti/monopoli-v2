const { newPromise, newResponse, catchResponse, multipleConcat } = require('../helpers/basic')
const { selectAll, 
        selectOne, 
        insertDataRow, 
        updateData, 
        deleteAll } = require('../helpers/databaseQueries')
/** 
 * QUERY HELPER FOR SELECTING COLUMNS
 * 
 * "SC_Helper.players" AND "SC_Helper.prepares"
 * refers to the name of the respective table.
 * 
 * the keys inside "players table" AND "prepares table"
 * are value for selecting columns
 */
const SC_Helper = {
    /** 
     * @param players.all select all columns .
     * @param players.no_id select all columns except id .
     * @param players.username select only username column .
     * @param players.uuid_username select only uuid and username columns .
     * @param players.id_username select only user_id and username columns .
     * @param players.belongings select harta_uang, harta_kota, kartu columns .
     * @param players.movement select pos, giliran, jalan columns .
     * @param players.misc select penjara, putaran columns .
     */
    players: {
        all: '*',
        no_id: 'user_id(id, username), pos, harta_uang, harta_kota, kartu, giliran, jalan, penjara, putaran',
        username: 'user_id(username)',
        uuid_username: 'user_id(uuid, username)',
        id_username: 'user_id(id, username)',
        belongings: 'harta_uang, harta_kota, kartu',
        movement: 'pos, giliran, jalan',
        misc: 'penjara, putaran, transfer, sell_city'
    },
    /** 
     * @param prepares.all select all columns .
     * @param prepares.no_id select all columns except id .
     */
    prepares: {
        all: '*',
        no_id: 'player_joined, player_forcing, player_ready, player_rand'
    }
}

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
        const queryObject = {
            table: 'games',
            selectColumn: 'status',
            multipleWhere: false,
            whereColumn: 'id',
            whereValue: 1,
            get updateColumn() {
                return {
                    status: gameStatus
                }
            }
        }
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
        // username dengkul is specified as admin
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
            selectColumn: SC_Helper.prepares.all
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
        // required data for query
        const queryObject = {
            table: 'prepares',
            selectColumn: SC_Helper.prepares.no_id,
            get insertColumn() {
                return {
                    player_joined: username,
                    player_forcing: false,
                    player_ready: false,
                    player_rand: randNumber
                }
            }
        }
        // insert player data when joined 
        return newPromise(insertDataRow(res, queryObject))
        .then(() => {
            // get all player data who joined
            return newPromise(selectAll(res, queryObject))
            .catch(err => catchResponse(res, err, 'Monopoli.playerJoinedRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.playerJoinedRepo 1'))
    }

    playerForceStartRepo(req, res) {
        // TABLE = prepares
        const { username } = req.body
        // required data for query
        const queryObject = {
            table: 'prepares',
            selectColumn: SC_Helper.prepares.no_id,
            multipleWhere: false,
            whereColumn: 'player_joined',
            whereValue: username,
            get updateColumn() {
                return {
                    player_forcing: true
                }
            }
        } 
        // update player_forcing: true
        return newPromise(updateData(res, queryObject))
        .then(() => {
            // get all player data
            return newPromise(selectAll(res, queryObject))
            .catch(err => catchResponse(res, err, 'Monopoli.forceStartRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.forceStartRepo 1'))
    }

    // PERLU DATA LENGKAP PLAYER KARNA SEMUA KOLOM PERLU VALUE
    playerReadyRepo(req, res) {
        // TABLE = prepares
        const { 
            user_id, username, 
            pos, harta_uang, 
            harta_kota, kartu, 
            giliran, jalan, 
            penjara, putaran,
            transfer, sell_city 
        } = req.body
        // required data for query
        const queryObject = {
            table: 'prepares',
            multipleWhere: false,
            whereColumn: 'player_joined',
            whereValue: username,
            get updateColumn() {
                return {
                    player_ready: true
                }
            }
        } 
        // TABLE = players
        // required data for query
        const queryObject2 = {
            table: 'players',
            selectColumn: multipleConcat([SC_Helper.players.id_username, SC_Helper.players.belongings, SC_Helper.players.movement]),
            get insertColumn() {
                return {
                    user_id: user_id,
                    pos: pos,
                    harta_uang: harta_uang,
                    harta_kota: harta_kota,
                    kartu: kartu,
                    giliran: giliran,
                    jalan: jalan,
                    penjara: penjara,
                    putaran: putaran,
                    transfer: transfer,
                    sell_city: sell_city
                }
            }
        } 
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
        // required data for query
        const queryObject = {
            table: 'players',
            selectColumn: multipleConcat([SC_Helper.players.username, SC_Helper.players.belongings, SC_Helper.players.movement, SC_Helper.players.misc]),
            multipleWhere: false,
            whereColumn: 'user_id',
            whereValue: user_id
        } 
        // get player data that is moving
        return newPromise(selectOne(res, queryObject))
        .then(resultOne => {
            if(resultOne.length == 0)
                return newResponse(404, res, `player(moving) tidak ditemukan`)
            return resultOne
        })
        .catch(err => catchResponse(res, err, 'Monopoli.playerMovingRepo'))
    }

    // PERLU DATA LENGKAP PLAYER KARNA SEMUA KOLOM PERLU VALUE
    playerTurnEndRepo(req, res) {
        const { 
            money_lose_mods,
            user_id, pos, 
            harta_uang, harta_kota, 
            kartu, jalan, 
            penjara, putaran, 
            transfer, sell_city,
            next_player, lost_players, 
            tax_payment 
        } = req.body
        // temp harta_kota value to anticipate if current player is losing
        let hartaKotaFiltered = harta_kota
        // check if current end player is losing or not
        if(harta_uang < -money_lose_mods) {
            hartaKotaFiltered = ''
        }
        // TABLE = players
        // required data for query
        const queryObject = {
            table: 'players',
            multipleWhere: false,
            whereColumn: 'user_id',
            whereValue: user_id,
            get updateColumn() {
                return {
                    pos: pos,
                    harta_uang: harta_uang,
                    harta_kota: hartaKotaFiltered,
                    kartu: kartu,
                    jalan: jalan,
                    penjara: penjara,
                    putaran: putaran,
                    transfer: transfer,
                    sell_city: sell_city
                } 
            }
        } 
        const queryObject2 = {
            table: 'players',
            selectColumn: multipleConcat([SC_Helper.players.id_username, SC_Helper.players.belongings, SC_Helper.players.movement]),
            multipleWhere: false,
            whereColumn: 'user_id',
            whereValue: next_player,
            get updateColumn() {
                return {
                    jalan: true
                }
            }
        } 
        // if tax payment exist
        if(tax_payment) {
            const queryObject3 = {
                table: 'players',
                multipleWhere: false,
                whereColumn: 'user_id',
                whereValue: tax_payment.target_owner,
                get updateColumn() {
                    return {
                        harta_uang: tax_payment.target_money
                    }
                }
            }
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
            // update next player jalan to TRUE and get the data
            return newPromise(updateData(res, queryObject2))
            .then(resultOne => {
                if(resultOne.length == 0)
                    return newResponse(404, res, 'user(next_player) tidak ditemukan')
                // get other player data from players table
                return newPromise(selectAll(res, queryObject2))
                .then(resultAll => {
                    if(resultAll.length == 0)
                        return newResponse(404, res, 'user(all_players) tidak ditemukan')
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
        // required data for query
        const queryObject = {
            table: 'players',
            selectColumn: multipleConcat([SC_Helper.players.id_username, SC_Helper.players.movement, SC_Helper.players.belongings, SC_Helper.players.misc])
        }
        // get all players 
        return newPromise(selectAll(res, queryObject))
        .catch(err => catchResponse(res, err, 'Monopoli.gameResumeRepo'))
    }

    getCitiesAndCardsRepo(req, res) {
        const { uuid } = req.query
        // TABLE = players
        // required data for query
        const queryObject = {
            table: 'players',
            selectColumn: multipleConcat([SC_Helper.players.uuid_username, SC_Helper.players.belongings, SC_Helper.players.movement, SC_Helper.players.misc])
        }
        // using selectAll because selectOne cant find by uuid directly
        return newPromise(selectAll(res, queryObject))
        .then(resultAll => {
            const findUUID = resultAll.map(v => {return v.user_id.uuid}).indexOf(uuid)
            if(findUUID !== -1) {
                const citiesAndCardsData = {
                    username: resultAll[findUUID].user_id.username,
                    harta_uang: resultAll[findUUID].harta_uang,
                    harta_kota: resultAll[findUUID].harta_kota,
                    kartu: resultAll[findUUID].kartu,
                    jalan: resultAll[findUUID].jalan,
                    putaran: resultAll[findUUID].putaran,
                    sell_city: resultAll[findUUID].sell_city
                }
                return [citiesAndCardsData]
            }
            else {
                return newResponse(404, res, 'user(all) tidak ditemukan')
            }
        })
        .catch(err => catchResponse(res, err, 'Monopoli.getCitiesAndCardsRepo'))
    }

    playerSellCityRepo(req, res) {
        const { user_id, money_after_sale, city_for_sale, cities_after_sale, sell_city } = req.body
        // TABLE = players
        // required data for query
        const queryObject = {
            table: 'players',
            selectColumn: multipleConcat([SC_Helper.players.id_username, SC_Helper.players.belongings]),
            multipleWhere: false,
            whereColumn: 'user_id',
            whereValue: user_id,
            get updateColumn() {
                return {
                    harta_uang: money_after_sale,
                    harta_kota: cities_after_sale,
                    sell_city: sell_city
                }
            }
        }
        // update player data whom gets money from selling city
        return newPromise(updateData(res, queryObject))
        .then(() => {
            return newPromise(selectAll(res, queryObject))
            .then(resultAll => {
                // find player username who did sell city
                const citySellerUsername = resultAll.map(v => {
                    if(v.user_id.id === user_id) return v.user_id.username
                }).filter(i => i)[0]
                // custom payload
                const citySellerObj = {
                    username: citySellerUsername,
                    city_for_sale: city_for_sale,
                    playerSellCityAll: resultAll
                }
                return [citySellerObj]
            })
            .catch(err => catchResponse(res, err, 'Monopoli.playerSellCityRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.playerSellCityRepo 1'))
    }

    playerUpgradeCityRepo(req, res) {
        const { user_id, city_for_upgrade, cities_after_upgrade, money_after_upgrade } = req.body
        // TABLE = players
        // required data for query
        const queryObject = {
            table: 'players',
            selectColumn: multipleConcat([SC_Helper.players.id_username, SC_Helper.players.belongings]),
            multipleWhere: false,
            whereColumn: 'user_id',
            whereValue: user_id,
            get updateColumn() {
                return {
                    harta_uang: money_after_upgrade,
                    harta_kota: cities_after_upgrade
                }
            }
        }
        // update player data after upgrade a city
        return newPromise(updateData(res, queryObject))
        .then(() => {
            return newPromise(selectAll(res, queryObject))
            .then(resultAll => {
                // find player username who did sell city
                const cityUpgradeUsername = resultAll.map(v => {
                    if(v.user_id.id === user_id) return v.user_id.username
                }).filter(i => i)[0]
                // custom payload
                const cityUpgradeObj = {
                    username: cityUpgradeUsername,
                    city_for_upgrade: city_for_upgrade,
                    playerUpgradeCityAll: resultAll
                }
                return [cityUpgradeObj]
            })
            .catch(err => catchResponse(res, err, 'Monopoli.playerUpgradeCityRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.playerUpgradeCityRepo 1'))
    }

    playerSurrenderRepo(req, res) {
        const { user_id, harta_uang, harta_kota, kartu } = req.body
        // TABLE = players
        // required data for query
        const queryObject = {
            table: 'players',
            selectColumn: multipleConcat([SC_Helper.players.username, SC_Helper.players.movement, SC_Helper.players.belongings]),
            multipleWhere: false,
            whereColumn: 'user_id',
            whereValue: user_id,
            get updateColumn() {
                return {
                    harta_uang: harta_uang,
                    harta_kota: harta_kota,
                    kartu: kartu
                }
            }
        }
        // check player's turn
        return newPromise(selectOne(res, queryObject))
        .then(resultOne => {
            // if its the player's turn
            if(resultOne[0].jalan === true) {
                const failedObj = {errorMessage: `Tidak bisa saat sedang 'Giliran Anda'`}
                return [failedObj]
            }
            // update surrender player data
            return newPromise(updateData(res, queryObject))
            .then(() => {
                // get all player data
                return newPromise(selectAll(req, queryObject))
                .catch(err => catchResponse(res, err, 'Monopoli.playerSurrenderRepo 3'))
            })
            .catch(err => catchResponse(res, err, 'Monopoli.playerSurrenderRepo 2'))
        })
        .catch(err => catchResponse(res, err, 'Monopoli.playerSurrenderRepo 1'))
    }
}

module.exports = MonopoliRepo