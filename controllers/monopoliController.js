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
        .then(result => {
            if(result.length > 0) {
                return newResponse([200, 'success getGameStatus'], res, result)
            }
            if(result.statusCode != 200) return
        })
    }

    updateGameStatus(req, res) {
        // get mods data 
        MonopoliRepo.updateGameStatusRepo(req, res)
        .then(result => {
            if(result.length > 0) {
                // send realtime data
                // pubnub 
                return pubnubPublish('gameStatus', result, res, 'success updateGameStatus') 
                // ably
                // ablyPublish('gameStatus', result, newResponse(200, res, 'game status updated'))
            }
            if(result.statusCode != 200) return
        })
    }

    deletePlayerRows(req, res) {
        MonopoliRepo.deletePlayerRowsRepo(req, res)
        .then(result => {
            return newResponse([200, 'success deletePlayerRows'], res, result)
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
        .then(result => {
            return newResponse([200, 'success changeModsData'], res, result)
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
                    if(resultMods.statusCode != 200) return
                })
            }
            if(resultJoined.statusCode != 200) return
        })
    }

    forceStart(req, res) {
        // get all player data who forced the game 
        MonopoliRepo.forceStartRepo(req, res)
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
                    if(resultMods.statusCode != 200) return
                })
            }
            if(resultForcing.statusCode != 200) return
        })
    }
    
    ready(req, res) {
        // get all player data who ready to play
        MonopoliRepo.readyRepo(req, res)
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
            if(resultReady.statusCode != 200) return
        })
    }

    playerMoving(req, res) {
        MonopoliRepo.playerMovingRepo(req, res)
        .then(resultMoving => {
            // get mods data 
            MonopoliRepo.getModsDataRepo(req, res)
            .then(resultMods => {
                if(resultMods.length > 0) {
                    const { playerDadu, username, branch, prison } = req.body
                    const jsonData = {
                        username: username, 
                        playerDadu: playerDadu, 
                        branch: branch,
                        prison: prison,
                        harta_uang: resultMoving[0].harta_uang,
                        harta_kota: resultMoving[0].harta_kota,
                        putaran: resultMoving[0].putaran,
                        giliran: resultMoving[0].giliran,
                        penjara: resultMoving[0].penjara
                    }
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
                if(resultMods.statusCode != 200) return
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
            if(resultTurnEnd.statusCode != 200) return
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
            if(result.statusCode != 200) return
        })
    }
    
}

module.exports = Monopoli