function filterRegisterLogin(filterData, regexes, spanElements, textValues, borderStyle, marks) {
    let tempFilterStatus = []
    for(let i in Object.values(filterData)) {
        // pusing bang kalo gk dibuat variable akwoaowkaowko
        const item = Object.values(filterData)
        // for username and password
        if(regexes[i] != null && item[i] != null) {
            // if the username or password meet reqs
            if(regexes[i] != null && inputFilter(item[i].value, regexes[i])) {
                tempFilterStatus[i] = false
                item[i].style.border = borderStyle
                spanElements[i].innerText = `${textValues[i]} ${marks[0]}`
            }
            // if not meet reqs
            else {
                tempFilterStatus[i] = true
                spanElements[i].innerText = `${textValues[i]} ${marks[1]}`
            }
        }
        // only for confirm password
        else if(regexes[i] == null && item[i] != null) {
            // confirmPassword [i] == password [i-1]
            if(item[i].value == item[i-1].value) {
                tempFilterStatus[i] = false
                item[i].style.border = borderStyle
                spanElements[i].innerText = `${textValues[i]} ${marks[0]}`
            }
            // if theres typo in the password
            else {
                tempFilterStatus[i] = true
                spanElements[i].innerText = `${textValues[i]} ${marks[1]}`
            }
        }
    }
    return tempFilterStatus
}

const check = '\u{2714}'
const cross = '\u{2716}'
// register
function playerRegisterOrLogin(type, targetButton) {
    // filter user input
    const filterData = {
        username: type == 'register' ? qS('#usernameReg') : qS('#usernameLog'),
        password: type == 'register' ? qS('#passwordReg') : qS('#passwordLog'),
        confirmPass: type == 'register' ? qS('#confirmPasswordReg') : null
    } 
    // filter status for error notif
    const filterStatus = {
        username: false,
        password: false,
        confirmPass: type == 'register' ? false : null
    }
    // username & password filter
    let getFilterStatus = filterRegisterLogin(
        // input data
        filterData, 
        // regex
        [/^[a-zA-Z]+$/, /^[a-zA-Z0-9]+$/], 
        // label elements
        type == 'register' ? 
            [qS('.usernameRegSpan'), qS('.passwordRegSpan'), qS('.confirmPassRegSpan')]
            :
            [qS('.usernameLogSpan'), qS('.passwordLogSpan')], 
        // label text
        type == 'register' ? 
            ['Username', 'Password', 'Confirm Pass']
            :
            ['Username', 'Password'], 
        // border & marks
        '2px solid blue', [check, cross]
    )
    // update filterStatus
    filterStatus.username = getFilterStatus[0]
    filterStatus.password = getFilterStatus[1]
    if(type == 'register')
        filterStatus.confirmPass = getFilterStatus[2]
    // display error if theres any
    if(filterStatus.username === true) {
        inputFilterError(filterData.username, 'username 4 ~ 10 huruf')
        targetButton.disabled = false
    }
    if(filterStatus.password === true) {
        inputFilterError(filterData.password, 'amb hekel klk')
        targetButton.disabled = false
    }
    if(type == 'register' && filterStatus.confirmPass === true) {
        inputFilterError(filterData.confirmPass, 'yg bener ya buntang')
        targetButton.disabled = false
    }
    // when theres no error in all input
    if(type == 'register') {
        if(filterStatus.username === false && filterStatus.password === false && filterStatus.confirmPass === false) {
            // payload
            const jsonData = {
                uuid: uuidv4(),
                username: filterData.username.value,
                password: filterData.password.value,
                status: 'logout'
            }
            // send data to server
            return fetcher('/register', 'POST', jsonData)
            .then(result => {
                return fetcherResults(result, 'register')
            })
            .catch(err => {
                return errorCapsule(err, anErrorOccured)
            })
        }
    }
    else if(type == 'login') {
        if(filterStatus.username === false && filterStatus.password === false) {
            // payload
            const jsonData = {
                username: filterData.username.value,
                password: filterData.password.value,
                status: 'login'
            }
            // send data to server
            return fetcher('/login', 'PATCH', jsonData)
            .then(result => {
                targetButton.disabled = false
                if(result.status == 400) {
                    filterData.username.value = ''
                    filterData.password.value = ''
                    filterData.username.placeholder = 'Wrong username!'
                    filterData.password.placeholder = 'Wrong password!'
                }
                return fetcherResults(result, 'login')
            })
            .catch(err => {
                return errorCapsule(err, anErrorOccured)
            })
        }
    }
}

function registerHandler(result) {
    removeDialog(qS('.dialog_wrapper'), qS('.dialog_info'))
    feedbackTurnOn(`[${result.data[0].username}] ${result.message}`)
    feedbackTurnOff()
}

function loginHandler(result) {
    // turn on notif
    feedbackTurnOn(`${result.data[0].username} berhasil login`)
    feedbackTurnOff()
    // save uuid in localStorage, so the system can recognize
    // the player when trying to resume the game after reload page
    setLocStorage('uuid', result.data[0].uuid)
    // save uuid and username to myGameData
    myGameData.id = result.data[0].id
    myGameData.uuid = result.data[0].uuid.split('-')[2]
    myGameData.username = result.data[0].username
    // close login dialog after login
    removeDialog(qS('.dialog_wrapper'), qS('.dialog_info'))
    // set username to input value
    qS('.userName').value = myGameData.username
    // display none register and login
    qS('.registerSpan').style.display = 'none'
    qS('.loginSpan').style.display = 'none'
}

function playerAutoLogin() {
    // auto login if user still have uuid in localStorage
    if(getLocStorage('uuid')) {
        return fetcher('/autologin', 'GET')
        .then(result => {
            return fetcherResults(result, 'autoLogin')
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
    }
}

function autoLoginHandler(result) {
    // save uuid and username to myGameData
    myGameData.id = result.data[0].id
    myGameData.uuid = result.data[0].uuid.split('-')[2]
    myGameData.username = result.data[0].username
    // set username to input value
    qS('.userName').value = myGameData.username
    // display none register and login
    qS('.registerSpan').style.display = 'none'
    qS('.loginSpan').style.display = 'none'
    // turn on notif
    feedbackTurnOn(`[${result.data[0].username}] berhasil login`)
    feedbackTurnOff()
}

function playerLogout() {
    // make sure only player who already logged in that can logout
    if(getLocStorage('uuid')) {
        return fetcher('/logout', 'PATCH', {status: 'logout'})
        .then(result => {
            return fetcherResults(result, 'logout')
        })
        .catch(err => {
            return errorCapsule(err, anErrorOccured)
        })
    }
    else {
        errorNotification('Apapula belum login uda logout..')
        return feedbackTurnOff()
    }
}

function logoutHandler(result) {
    const userLogout = result.data[0]
    if(getLocStorage('uuid') && userLogout.username == myGameData.username) {
        // turn on notif
        feedbackTurnOn(`${myGameData.username} berhasil logout`)
        feedbackTurnOff()
        // delete all user credentials
        localStorage.removeItem('uuid')
        myGameData.id = null
        myGameData.uuid = null
        myGameData.username = null
        // close login dialog after logout
        removeDialog(qS('.dialog_wrapper'), qS('.dialog_info'))
        // set username to input value
        qS('.userName').value = ''
        // display grid register and login
        qS('.registerSpan').style.display = 'inline'
        qS('.loginSpan').style.display = 'inline'
        return 
    }
}