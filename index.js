const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000
const monopoliRouter = require('./routes/monopoliRoute')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(monopoliRouter)

app.listen(port, () => {console.log(`listening to port ${port}`)})