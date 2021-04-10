import bodyParser from 'body-parser'
import compression from 'compression'
import express, { Application } from 'express'
import { Server } from 'http'

import { getAuth } from './controllers/getAuth'
import { getRoot } from './controllers/getRoot'
import { postProfile } from './controllers/postProfile'
import { postTransfer } from './controllers/postTransfer'

const port = 3000

export const createExpress = (): Application => {
  const app: Application = express()

  app.disable('x-powered-by')
  app.enable('trust proxy')

  app.use(compression({ level: 9 }))
  app.use(bodyParser.json())
  app.use(express.static('build/public'))

  app.get('/', getRoot)
  app.get('/auth', getRoot)

  app.get('/api/auth', getAuth)
  app.get('/api/health', (_req, res, _next) => res.status(200).send())
  app.post('/api/profile', postProfile)
  app.post('/api/transfer', postTransfer)

  return app
}

export const startService = async (
  expressApp: Application
): Promise<Server> => {
  console.log('Server running on port', port)

  return expressApp.listen(port)
}
