const url = window.location.origin
// store mods data from database to array var
let mods = []
// state of the game, used to manage player join / spectator
let gameStatus = null
// setInterval  
let startInterval = null
// player turns
const myGameData = {
    username: null, 
    pos: null, 
    harta_uang: null, 
    harta_kota: null, 
    kartu: null, 
    giliran: null,
    jalan: null, 
    penjara: null
}
let playersTurn = []
let giliranCounter = 0
let playersTurnShape = null
let laps = null
// get game status
getGameStatus()
// create monopoly board
createBoard()
// create game buttons
gameButtons()
// info buttons and dialog box
infoButtons()
confirmDialog()
// deciding the turn for each player and set up the game
decidePlayersTurn()
// roll the dice
kocokDaduTrigger()
// resume the game if a player need to reload the page
allPlayersLastPos()