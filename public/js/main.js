const url = window.location.origin
// store mods data from database to array var
let mods = []
// state of the game, used to manage player join / spectator
let gameStatus = null
// setInterval  
let startInterval = null
// player turns
const myGameData = {username: null, harta: null, kartu: null}
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