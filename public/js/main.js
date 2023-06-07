const url = window.location.origin
// store mods data from database to array var
let mods = []
// state of the game, used to manage player join / spectator
let gameStatus = null
// saving the user data
const myGameData = {
    id: null,
    uuid: null,
    username: null, 
    pos: null, 
    harta_uang: null, 
    harta_kota: null, 
    kartu: null, 
    giliran: null,
    jalan: null, 
    penjara: null
}
// for saving other player money/cards
let playersTurnObj = []
// player turns
let playersTurn = []
let playerTurnsId = []
let giliranCounter = 0
// to prevent realtime run 2x
const realtimeStatus = {
    turnEnd: false
}
// for branch map
// global branch, to display the private branch chance to other player
let branchChance = 100
// private branch, one per player
const myBranchChance = {
    username: null,
    chance: null,
    status: true
}
// laps counter
let laps = 1
// get game status
getGameStatus()
// create monopoly board
createBoard()
// create game buttons
gameButtons()
// info buttons and dialog box
infoButtons()
confirmDialog()
// auto login if uuid still in localStorage
playerAutoLogin()
// deciding the turn for each player and set up the game
decidePlayersTurn()
// roll the dice
kocokDaduTrigger()
// resume the game if a player need to reload the page
allPlayersLastPos()