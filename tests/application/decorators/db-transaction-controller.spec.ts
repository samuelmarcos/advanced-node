import { type DbTransaction, DbTransactionController } from '@/application/decorators'
import { type Controller } from '@/application/controllers'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  let sut: DbTransactionController
  let decoratee: MockProxy<Controller>
  let db: MockProxy<DbTransaction>

  beforeAll(() => {
    decoratee = mock()
    db = mock()
  })

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db)
  })

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })

  it('should execute decoratee', async () => {
    await sut.perform({ any: 'any' })

    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' })
    expect(decoratee.perform).toHaveBeenCalledTimes(1)
  })

  it('should call commit and close transaction on success', async () => {
    await sut.perform({ any: 'any' })

    expect(db.commit).toHaveBeenCalledWith()
    expect(db.commit).toHaveBeenCalledTimes(1)
    expect(db.rollback).not.toHaveBeenCalledWith()
    expect(db.rollback).not.toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })

  it('should call rollback and close transaction on fail', async () => {
    const error = new Error('perform_error')
    decoratee.perform.mockRejectedValueOnce(error)
    await sut.perform({ any: 'any' })

    expect(db.commit).not.toHaveBeenCalledWith()
    expect(db.commit).not.toHaveBeenCalledTimes(1)
    expect(db.rollback).toHaveBeenCalledWith()
    expect(db.rollback).toHaveBeenCalledTimes(1)
    expect(db.closeTransaction).toHaveBeenCalledWith()
    expect(db.closeTransaction).toHaveBeenCalledTimes(1)
  })
})
