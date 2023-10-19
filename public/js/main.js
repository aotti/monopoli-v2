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
    sweatJoy: '\u{1F605}',
    sob: '\u{1F62D}',
    cowboy: '\u{1F920}'
}
// saving the user data
const myGameData = {
    id: null,
    uuid: null,
    username: null
}
// for saving all players money/cards
const playersTurnObj = []
const playersMoneyEl = []
const playersPreMoney = []
// player turns
const playersTurn = []
const playersTurnId = []
// to prevent codes run 2x
const oneTimeStatus = {
    turnEnd: false,
    throughStart: false,
    transfer: false,
    sellCity: false
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
// global prison counter
let prisonCounter = 0
// private prison counter
const myPrisonCounter = {
    username: null,
    counter: 0,
    status: false
}
gameStatusCounter = 0
const gameStatusInterval = setInterval(async () => {
    if(gameStatusCounter < 1) {
        // get game status
        await getGameStatus()
    }
    else if(gameStatusCounter >= 1) {
        clearInterval(gameStatusInterval)
        delete gameStatusCounter
        // create monopoly board
        await createBoard()
        // create game buttons
        await gameButtons()
        // auto login if uuid still in localStorage
        await playerAutoLogin()
        // check game status before deciding the turn 
        // for each player and set up the game
        await checkGameStatus()
        // get number of waiting players
        await getWaitingPlayers()
        // resume the game if a player need to reload the page
        await allPlayersLastPos()
        return
    }
    gameStatusCounter++
}, 500);