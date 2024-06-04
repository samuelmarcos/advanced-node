import { mocked } from 'jest-mock'
import { type Connection, createConnection, getConnection, getConnectionManager, type QueryRunner } from 'typeorm'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))

class PgConnection {
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
    await getConnection().close()
    this.query = undefined
  }
}

describe('PgConnection', () => {
  let sut: PgConnection
  let getConnectionManagerSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let hasSpy: jest.Mock
  let closeSpy: jest.Mock

  beforeAll(() => {
    hasSpy = jest.fn().mockReturnValue(true)
    closeSpy = jest.fn()
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy
    })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    createQueryRunnerSpy = jest.fn()
    createConnectionSpy = jest.fn().mockResolvedValue({
      createQueryRunner: createQueryRunnerSpy
    })
    mocked(createConnection).mockImplementation(createConnectionSpy)

    getConnectionSpy = jest.fn().mockReturnValue({
      createQueryRunner: createQueryRunnerSpy,
      close: closeSpy
    })

    mocked(getConnection).mockImplementation(getConnectionSpy)
  })

  beforeEach(() => {
    sut = PgConnection.getInstance()
  })

  it('shoud had only one instance', async () => {
    hasSpy.mockReturnValueOnce(false)
    const sut2 = PgConnection.getInstance()

    expect(sut).toBe(sut2)
  })

  it('shoud create a new connection', async () => {
    await sut.connect()

    expect(createConnectionSpy).toHaveBeenCalledWith()
    expect(createConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })

  it('shoud use an existing connection', async () => {
    await sut.connect()

    expect(getConnectionSpy).toHaveBeenCalledWith()
    expect(getConnectionSpy).toHaveBeenCalledTimes(1)
    expect(createQueryRunnerSpy).toHaveBeenCalledWith()
    expect(createQueryRunnerSpy).toHaveBeenCalledTimes(1)
  })

  it('shoud close connection', async () => {
    await sut.connect()
    await sut.disconnect()

    expect(closeSpy).toHaveBeenCalledWith()
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })
})
