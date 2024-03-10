const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const passport = require('./config/passport')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

const app = express()
const port = process.env.PORT || 3000

app.use(cors(), express.json(), passport.initialize(), routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  console.info(`App is running on http://localhost:${port}`)
})
