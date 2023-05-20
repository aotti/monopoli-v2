const url = window.location.origin
// store mods data from database to array var
let mods = []
// player turns
let playersTurn = []
let giliranCounter = 0
let myShape = null
// create monopoly board
createBoard()
// create game buttons
gameButtons()
// info buttons and dialog box
infoButtons()
confirmDialog()
// deciding the turn for each player and set up the game
decidePlayersTurn()
// player moving
playerMoves()