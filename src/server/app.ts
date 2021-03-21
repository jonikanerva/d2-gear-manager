import compression from 'compression'
import express, { Application } from 'express'
import { Server } from 'http'

import { getAuth } from './controllers/getAuth'
import { getRoot } from './controllers/getRoot'

const app: Application = express()
const port = 3000

app.disable('x-powered-by')
app.enable('trust proxy')
app.use(compression({ level: 6 }))
app.use(express.static('build/public'))
app.get('/', getRoot)
app.get('/auth', getAuth)

export { app }

export const startService = async (
  expressApp: Application
): Promise<Server> => {
  console.log('Server running on port', port)

  return expressApp.listen(port)
}
