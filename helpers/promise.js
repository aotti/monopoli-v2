function newPromise(data) {
    return new Promise((resolve, reject) => {
        data().then(result => {
            if(result.data != null)
                resolve(result.data)
            else if(result.error != null)
                reject(result.error)
        })
    })
}

module.exports = { newPromise }