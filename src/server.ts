import { loadDestinyData } from './database'
import { createExpress, startService } from './server/app'

const app = createExpress()

loadDestinyData()
  .then(() => startService(app))
  .catch((e) => {
    console.log(e)

    process.exit(1)
  })
