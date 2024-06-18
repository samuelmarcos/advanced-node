import { type DbTransaction, DbTransactionController } from '@/application/decorators'

import { type MockProxy, mock } from 'jest-mock-extended'

describe('DbTransactionController', () => {
  let sut: DbTransactionController
  let db: MockProxy<DbTransaction>

  beforeAll(() => {
    db = mock()
  })

  beforeEach(() => {
    sut = new DbTransactionController(db)
  })

  it('should open transaction', async () => {
    await sut.perform({ any: 'any' })

    expect(db.openTransaction).toHaveBeenCalledWith()
    expect(db.openTransaction).toHaveBeenCalledTimes(1)
  })
})
