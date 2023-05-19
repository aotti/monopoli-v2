const url = window.location.origin
let mods = []
let playerTurns = []
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