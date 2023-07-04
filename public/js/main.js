const url = window.location.origin
// emoji
const emoji = {
    pray: '\u{1F64F}',
    house: '\u{1F3E0}',
    hotel: '\u{1F3E8}',
    sunglas: '\u{1F60E}',
    coffee: '\u{2615}',
    rectangle: '\u{25A2}',
    triangle: '\u{25B3}',
    diamond: '\u{25C7}',
    check: '\u{2714}',
    cross: '\u{2716}',
    catShock: '\u{1F640}',
    warning: '\u{2755}',
    joy: '\u{1F923}',
    sweatJoy: '\u{1F605}'
}
// saving the user data
const myGameData = {
    id: null,
    uuid: null,
    username: null
}
// for saving other player money/cards
const playersTurnObj = []
const playersPreMoney = []
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
// prison counter
let prisonCounter = 0
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