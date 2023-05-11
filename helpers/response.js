function newResponse(type, res, data) {
    switch(type) {
        case 200:
            return res.status(200).json({
                status: 200,
                message: 'success',
                data: data
            })
        case 400:
            return res.status(400).json({
                status: 400,
                errorMessage: data
            })
        case 500:
            return res.status(500).json({
                status: 500,
                errorMessage: data
            })
    }
}

module.exports = {newResponse}