function newPromise(data) {
    return new Promise((resolve, reject) => {
        data.then(result => {
            if(result.error != null)
                return reject(result.error)
            return resolve(result.data)
        })
    })
}

module.exports = { newPromise }