import { type ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'samumnb',
  password: 'senha',
  database: 'facebook_login',
  entities: ['dist/infra/postgres/entities/index.js']
}
