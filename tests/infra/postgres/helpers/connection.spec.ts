import { ConnectionNotFoundError, PgConnection } from '@/infra/repos/postgres/helpers'

import { mocked } from 'jest-mock'
import { release } from 'os'
import { createConnection, getConnection, getConnectionManager } from 'typeorm'

jest.mock('typeorm', () => ({
  Entity: jest.fn(),
  PrimaryGeneratedColumn: jest.fn(),
  Column: jest.fn(),
  createConnection: jest.fn(),
  getConnection: jest.fn(),
  getConnectionManager: jest.fn()
}))

describe('PgConnection', () => {
  let sut: PgConnection
  let getConnectionManagerSpy: jest.Mock
  let createQueryRunnerSpy: jest.Mock
  let createConnectionSpy: jest.Mock
  let getConnectionSpy: jest.Mock
  let hasSpy: jest.Mock
  let closeSpy: jest.Mock
  let startTransactionSpy: jest.Mock
  let releaseSpy: jest.Mock

  beforeAll(() => {
    startTransactionSpy = jest.fn()
    releaseSpy = jest.fn()
    hasSpy = jest.fn().mockReturnValue(true)
    closeSpy = jest.fn()
    getConnectionManagerSpy = jest.fn().mockReturnValue({
      has: hasSpy
    })
    mocked(getConnectionManager).mockImplementation(getConnectionManagerSpy)
    createQueryRunnerSpy = jest.fn().mockReturnValue({
      startTransaction: startTransactionSpy,
      release: releaseSpy
    })
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

  it('shoud return ConnectionNotFoundError on disconnect if connect is not found', async () => {
    const promise = sut.disconnect()

    expect(closeSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('shoud openTransaction', async () => {
    await sut.connect()
    await sut.openTransaction()

    expect(startTransactionSpy).toHaveBeenCalled()
    expect(startTransactionSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('shoud return ConnectionNotFoundError on openTransaction if connect is not found', async () => {
    const promise = sut.openTransaction()

    expect(startTransactionSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })

  it('shoud closeTransaction', async () => {
    await sut.connect()
    await sut.closeTransaction()

    expect(releaseSpy).toHaveBeenCalled()
    expect(releaseSpy).toHaveBeenCalledTimes(1)

    await sut.disconnect()
  })

  it('shoud return ConnectionNotFoundError on closeTransaction if connect is not found', async () => {
    const promise = sut.closeTransaction()

    expect(releaseSpy).not.toHaveBeenCalled()
    await expect(promise).rejects.toThrow(new ConnectionNotFoundError())
  })
})
