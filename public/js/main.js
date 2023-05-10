const url = window.location.origin
let mods = []
// create monopoli board
createBoard()
// insert images to board
insertImagesToBoard()
// create game buttons
gameButtons()
// info buttons and dialog box
infoButtons()
confirmDialog()
// player actions
decidePlayersTurn()