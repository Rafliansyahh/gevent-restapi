const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require ('body-parser')
const cors = require('cors')
require('dotenv').config()

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors())

// import routes
const authRoutes = require('./routes/auth')
const geventRoutes = require('./routes/gevent')

app.use('/auth', authRoutes)
app.use('/gevent', geventRoutes)

app.get('/', (req, res) => {
  res.send('Welcome gevent REST API')
})

mongoose.connect(process.env.DB_CONNECTION,{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let db = mongoose.connection

//handle error
db.on('error', console.error.bind(console,'Error establishing a database connection'))

//handle succes
db.once('open',() => {
  console.log('Database is connected')
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})