const admin = require('./apis/admin')
const course = require('./apis/course')
const OAuth = require('./apis/OAuth')
const register = require('./apis/register')
const user = require('./apis/user')

const components = require('./components')

const openapi = '3.0.0'

const info = {
  title: 'tutor-API-docs',
  version: '1.0.0'
}

const externalDocs = {
  description: 'Find out more about Swagger',
  url: 'http://swagger.io'
}

const servers = [
  {
    url: 'http://localhost:3000'
  },
  {
    url: 'http://34.125.232.84:3000'
  }
]

const tags = [
  {
    name: 'user',
    description: 'Operations about user'
  },
  {
    name: 'course',
    description: 'Operations about course'
  },
  {
    name: 'registration',
    description: 'Operations about registration'
  },
  {
    name: 'admin',
    description: 'Operations about admin'
  },
  {
    name: 'OAuth',
    description: '3rd authentication'
  }
]

const paths = {
  ...user,
  ...admin,
  ...course,
  ...register,
  ...OAuth
}

module.exports = {
  openapi,
  info,
  externalDocs,
  servers,
  tags,
  paths,
  components
}
