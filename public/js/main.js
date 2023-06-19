const url = window.location.origin
// saving the user data
const myGameData = {
    id: null,
    uuid: null,
    username: null
}
// for saving other player money/cards
const playersTurnObj = []
// player turns
const playersTurn = []
const playersTurnId = []
// to prevent codes run 2x
const oneTimeStatus = {
    turnEnd: false,
    throughStart: false
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
// get game status
getGameStatus()
// create monopoly board
createBoard()
// create game buttons
gameButtons()
// auto login if uuid still in localStorage
playerAutoLogin()
// check game status before deciding the turn 
// for each player and set up the game
checkGameStatus()
// resume the game if a player need to reload the page
allPlayersLastPos()