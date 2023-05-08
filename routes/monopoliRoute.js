const router = require('express').Router()
const monopoliController = require('../controllers/monopoliController')
const Monopoli = new monopoliController()

router
    .get('/api/mods', Monopoli.getModsData)

module.exports = router