// Happy coding guys
const express = require('express')
const app = express()
const port = 3000 
const routes = require('./routes/index.js')
const Controller = require('./controllers/controller.js')

app.use(express.urlencoded({ extended: false }))
app.set("view engine", "ejs");
app.use("/", routes)

app.listen(port, () => {
  console.log(`Welcome to Dota 2 ${port}`)
})

// app.routes("", Controller.....)
