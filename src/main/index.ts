import './config/module-alias'
import 'reflect-metadata'
import { createConnection } from 'typeorm'

import { env } from './config/env'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
createConnection().then(async () => {
  const { app } = await import ('./config/app')
  app.listen(env.appPort, () => console.log(`Server running on port ${env.appPort}`))
}).catch(console.error)
