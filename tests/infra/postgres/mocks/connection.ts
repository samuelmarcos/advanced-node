import { PgConnection } from '@/infra/repos/postgres/helpers'
import { newDb, type IMemoryDb } from 'pg-mem'
import { type Connection } from 'typeorm'

export const makeFakeDB = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection: Connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/repos/postgres/entities/index.ts']
  })

  await connection.synchronize()
  await PgConnection.getInstance().connect()

  return db
}
