import { createExpress, startService } from './server/app'

const app = createExpress()

startService(app).catch(() => {
  process.exit(1)
})
