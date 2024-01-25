import './config/module-alias'

import { env } from './config/env'
import { app } from './config/app'

import 'reflect-metadata'
import { createConnection } from 'typeorm'

createConnection()
  .then(() => {
    app.listen(env.appPort, () => console.log(`Server running on port ${env.appPort}`))
  })
  .catch(console.error)
