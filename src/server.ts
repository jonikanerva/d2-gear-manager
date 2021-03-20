import { startService, app } from './server/app'

startService(app).catch(() => {
  process.exit(1)
})
