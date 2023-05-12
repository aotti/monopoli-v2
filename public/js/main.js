const url = window.location.origin
let mods = []
// create monopoli board
createBoard()
// create game buttons
gameButtons()
// info buttons and dialog box
infoButtons()
confirmDialog()
// deciding the turn for each player 
decidePlayersTurn()