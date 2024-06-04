import { type Connection, createConnection, getConnection, getConnectionManager, type QueryRunner } from 'typeorm'
import { ConnectionNotFoundError } from './erros'

export class PgConnection {
  private static instance: PgConnection
  private query?: QueryRunner

  private constructor () {}

  static getInstance (): PgConnection {
    if (PgConnection.instance === undefined) {
      PgConnection.instance = new PgConnection()
    }
    return PgConnection.instance
  }

  async connect (): Promise<void> {
    const connection: Connection = getConnectionManager().has('default')
      ? getConnection()
      : await createConnection()

    this.query = connection.createQueryRunner()
  }

  async disconnect (): Promise<void> {
    if (this.query === undefined) {
      throw new ConnectionNotFoundError()
    }
    await getConnection().close()
    this.query = undefined
  }
}
