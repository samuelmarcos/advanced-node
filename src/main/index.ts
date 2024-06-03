import './config/module-alias'
import 'reflect-metadata'
import { createConnection, getConnectionOptions } from 'typeorm'

import { env } from './config/env'

// eslint-disable-next-line @typescript-eslint/no-floating-promises
getConnectionOptions().then(async options => {
  const root = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'
  const entities = [`${root}/infra/repos/postgres/entities/index.{js,ts}`]
  await createConnection({ ...options, entities })
  const { app } = await import ('./config/app')
  app.listen(env.appPort, () => console.log(`Server running on port ${env.appPort}`))
}).catch(console.error)
