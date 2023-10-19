// response manage
const { newResponse } = require('../helpers/basic')
// database manage
const monopoliRepo = require('../repository/monopoliRepo')
const MonopoliRepo = new monopoliRepo()
// realtime helper
const { pubnubPublish } = require('../helpers/pubnubRealtime')
const { ablyPublish } = require('../helpers/ablyRealtime')

class Monopoli {
    getGameStatus(req, res) {
        // get mods data 
        MonopoliRepo.getGameStatusRepo(req, res)
        .then(resultGetGameStatus => {
            if(resultGetGameStatus.length > 0) {
                return newResponse([200, 'success getGameStatus'], res, resultGetGameStatus)
            }
            // do nothing if theres an error, the error has been handled in repo
            if(resultGetGameStatus.statusCode !== 200) return
        })
    }

    updateGameStatus(req, res) {
        // get mods data 
        MonopoliRepo.updateGameStatusRepo(req, res)
        .then(resultUpdateGameStatus => {
            const { statusCode, errorMessage } = resultUpdateGameStatus
            if(resultUpdateGameStatus.length > 0) {
                // send realtime data
                // pubnub 
                return pubnubPublish('gameStatus', resultUpdateGameStatus, res, 'success updateGameStatus') 
                // ably
                // ablyPublish('gameStatus', resultUpdateGameStatus, newResponse(200, res, 'game status updated'))
            }
            // send error response if theres an error
            if(statusCode !== 200) 
                return newResponse(statusCode, res, errorMessage)
        })
    }

    deletePlayerRows(req, res) {
        MonopoliRepo.deletePlayerRowsRepo(req, res)
        .then(resultDeletePlayer => {
            const { statusCode, errorMessage } = resultDeletePlayer
            // "resultDeletePlayer = null" means delete success
            if(resultDeletePlayer.length > 0)
                return newResponse([200, 'success deletePlayerRows'], res, resultDeletePlayer)
            else if(resultDeletePlayer.length === 0)
                return newResponse([200, 'success deletePlayerRows'], res, 'table is empty')
            // if theres statusCode 401, it means non admin player trying to delete
            else if(statusCode !== 200) {
                return newResponse(statusCode, res, errorMessage)
            }
        })
    }

    getModsData(req, res) {
        // get mods data 
        MonopoliRepo.getModsDataRepo(req, res)
        .then(result => {
            return newResponse([200, 'success getModsData'], res, result)
        })
    }

    changeModsData(req, res) {
        // update mods data
        MonopoliRepo.changeModsDataRepo(req, res)
        .then(resultChangeMods => {
            const { statusCode, errorMessage } = resultChangeMods
            if(resultChangeMods.length > 0)
                return newResponse([200, 'success changeModsData'], res, resultChangeMods)
            // send error response if theres an error
            else if(statusCode !== 200) 
                return newResponse(statusCode, res, errorMessage)
        })
    }

    getWaitingPlayers(req, res) {
        // get all waiting players
        MonopoliRepo.getWaitingPlayersRepo(req, res)
        .then(resultGetWaitingPlayers => {
            MonopoliRepo.getGameStatusRepo(req, res)
            .then(resultGetGameStatus => {
                // only run the realtime if the game state is unready
                if(resultGetGameStatus[0].status == 'unready') {
                    // check type data then send realtime data
                    if(typeof resultGetWaitingPlayers === 'object') 
                        return pubnubPublish('waitingPlayers', resultGetWaitingPlayers, res, `success getWaitingPlayers`)
                    // do nothing if theres an error, the error has been handled in repo
                    if(resultGetWaitingPlayers.statusCode !== 200) return
                }
            })
        })
    }

    playerJoined(req, res) {
        // get all player data who joined the game 
        MonopoliRepo.playerJoinedRepo(req, res)
        .then(resultJoined => {
            if(resultJoined.length > 0) {
                // get mods data 
                MonopoliRepo.getModsDataRepo(req, res)
                .then(resultMods => {
                    if(resultMods.length > 0) {
                        MonopoliRepo.getGameStatusRepo(req, res)
                        .then(resultGameStatus => {
                            const payload = {
                                playerJoined: resultJoined,
                                mods: resultMods,
                                gameStatus: resultGameStatus
                            }
                            // send realtime data
                            // pubnub 
                            return pubnubPublish('playerJoined', payload, res, `success playerJoined`)
                            // ably
                            // ablyPublish('playerJoined', result, newResponse(200, res, `${result.player_joined} joining the game`))
                        })
                    }
                    // do nothing if theres an error, the error has been handled in repo
                    if(resultMods.statusCode !== 200) return
                })
            }
            // do nothing if theres an error, the error has been handled in repo
            if(resultJoined.statusCode !== 200) return
        })
    }

    playerForceStart(req, res) {
        // get all player data who forced the game 
        MonopoliRepo.playerForceStartRepo(req, res)
        .then(resultForcing => {
            if(resultForcing.length > 0) {
                // get mods data 
                MonopoliRepo.getModsDataRepo(req, res)
                .then(resultMods => {
                    if(resultMods.length > 0) {
                        MonopoliRepo.getGameStatusRepo(req, res)
                        .then(resultGameStatus => {
                            const payload = {
                                playerForcing: resultForcing,
                                mods: resultMods,
                                gameStatus: resultGameStatus
                            }
                            // send realtime data
                            // pubnub 
                            return pubnubPublish('playerForcing', payload, res, 'success forceStart')
                            // ably
                            // ablyPublish('playerForcing', result, newResponse(200, res, `updated`))
                        })
                    }
                    // do nothing if theres an error, the error has been handled in repo
                    if(resultMods.statusCode !== 200) return
                })
            }
            // do nothing if theres an error, the error has been handled in repo
            if(resultForcing.statusCode !== 200) return
        })
    }
    
    playerReady(req, res) {
        // get all player data who ready to play
        MonopoliRepo.playerReadyRepo(req, res)
        .then(resultReady => {
            if(resultReady.length > 0) {
                // get mods data 
                MonopoliRepo.getModsDataRepo(req, res)
                .then(resultMods => {
                    const payload = {
                        playerReady: resultReady,
                        mods: resultMods
                    }
                    // send realtime data
                    // pubnub 
                    return pubnubPublish('playerReady', payload, res, 'success ready')
                    // ably
                    // ablyPublish('playerReady', resultReady, newResponse(200, res, `ready`))
                })
            }
            // do nothing if theres an error, the error has been handled in repo
            if(resultReady.statusCode !== 200) return
        })
    }

    playerMoving(req, res) {
        MonopoliRepo.playerMovingRepo(req, res)
        .then(resultMoving => {
            // get mods data 
            MonopoliRepo.getModsDataRepo(req, res)
            .then(resultMods => {
                if(resultMods.length > 0) {
                    // from kocok dadu trigger
                    const { playerDadu, username, branch, prison } = req.body
                    // data for current player moving
                    const jsonData = {
                        username: username, 
                        playerDadu: playerDadu, 
                        branch: branch,
                        prison: prison,
                        harta_uang: resultMoving[0].harta_uang,
                        harta_kota: resultMoving[0].harta_kota,
                        kartu: resultMoving[0].kartu,
                        putaran: resultMoving[0].putaran,
                        giliran: resultMoving[0].giliran,
                        penjara: resultMoving[0].penjara
                    }
                    // simplify it as payload then send to client side
                    const payload = {
                        playerMoving: jsonData,
                        mods: resultMods
                    }
                    // send realtime data
                    // pubnub 
                    return pubnubPublish('playerMoving', payload, res, 'success playerMoving')
                    // ably
                    // ablyPublish('playerMoving', jsonData, newResponse(200, res, `player moving`))
                }
                // do nothing if theres an error, the error has been handled in repo
                if(resultMods.statusCode !== 200) return
            })
        })
    }

    playerTurnEnd(req, res) {
        // get all player data who ready to play
        MonopoliRepo.playerTurnEndRepo(req, res)
        .then(resultTurnEnd => {
            if(resultTurnEnd.length > 0) {
                // get mods data 
                MonopoliRepo.getModsDataRepo(req, res)
                .then(resultMods => {
                    const payload = {
                        playerTurnEnd: resultTurnEnd,
                        mods: resultMods
                    }
                    // return newResponse([200, 'success playerTurnEnd'], res, resultTurnEnd)
                    // send realtime data
                    // pubnub 
                    return pubnubPublish('playerTurnEnd', payload, res, 'success playerTurnEnd') 
                    // ably
                    // ablyPublish('playerTurnEnd', resultTurnEnd, newResponse(200, res, `turn end`))
                })
            }
            // do nothing if theres an error, the error has been handled in repo
            if(resultTurnEnd.statusCode !== 200) return
        })
    }

    gameResume(req, res) {
        MonopoliRepo.gameResumeRepo(req, res)
        .then(result => {
            if(result.length > 0) {
                // get mods data 
                MonopoliRepo.getModsDataRepo(req, res)
                .then(resultMods => {
                    const payload = {
                        resumePlayer: result,
                        mods: resultMods
                    }
                    return newResponse([200, 'success gameResume'], res, payload)
                })
            }
            // do nothing if theres an error, the error has been handled in repo
            if(result.statusCode !== 200) return
        })
    }
    
    getCitiesAndCards(req, res) {
        MonopoliRepo.getCitiesAndCardsRepo(req, res)
        .then(resultCitiesAndCards => {
            // check data length then send fetch data
            if(resultCitiesAndCards.length === 1) 
                return newResponse([200, 'success getCitiesAndCards'], res, resultCitiesAndCards[0])
            // do nothing if theres an error, the error has been handled in repo
            if(resultCitiesAndCards.statusCode !== 200) return
        })
    }

    playerSellCity(req, res) {
        MonopoliRepo.playerSellCityRepo(req, res)
        .then(resultPlayerSellCity => {
            // check data length then send fetch data
            if(resultPlayerSellCity.length === 1) 
                return pubnubPublish('playerSellCity', resultPlayerSellCity, res, `success playerSellCity`)
            // do nothing if theres an error, the error has been handled in repo
            if(resultPlayerSellCity.statusCode !== 200) return
        })
    }

    playerUpgradeCity(req, res) {
        MonopoliRepo.playerUpgradeCityRepo(req, res)
        .then(resultPlayerUpgradeCity => {
            // check data length then send fetch data
            if(resultPlayerUpgradeCity.length === 1) 
                return pubnubPublish('playerUpgradeCity', resultPlayerUpgradeCity, res, `success playerUpgradeCity`)
            // do nothing if theres an error, the error has been handled in repo
            if(resultPlayerUpgradeCity.statusCode !== 200) return
        })
    }

    playerSurrender(req, res) {
        MonopoliRepo.playerSurrenderRepo(req, res)
        .then(resultPlayerSurrender => {
            // check data length then send fetch data
            if(resultPlayerSurrender.length > 0) {
                if(resultPlayerSurrender[0].errorMessage)
                    return newResponse([200, 'failed playerSurrender'], res, resultPlayerSurrender[0])
                return pubnubPublish('playerSurrender', resultPlayerSurrender, res, `success playerSurrender`)
            }
            // do nothing if theres an error, the error has been handled in repo
            if(resultPlayerSurrender.statusCode !== 200) return
        })
    }
}

module.exports = Monopoli