const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();  //./db wali file mai jai ga, udhr function ko call kr rha hai
const app = express()  //for routing
const port = 5000   //front aur back ka port num diff hona chahiai

app.use(cors())   //connection with frontend
app.use(express.json())

// Available Routes
app.use('/api/auth', require('./routes/auth'))   //api means kis route pai jana hai
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {   //jis port pai run ho rha hai uskai liai function hai
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})

