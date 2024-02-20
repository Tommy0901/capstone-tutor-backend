const express = require('express')
const routes = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json(), passport.initialize(), routes)

app.listen(port, () => {
  console.info(`App is running on http://localhost:${port}`)
})
