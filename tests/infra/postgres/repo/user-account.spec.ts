import { type IBackup } from 'pg-mem'
import { PgUser } from '@/infra/postgres/entities'
import { getRepository, type Repository, getConnection } from 'typeorm'
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { makeFakeDB } from '@/tests/infra/postgres/mocks'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDB()
    backup = db.backup()
    pgUserRepo = getRepository(PgUser)
  })

  afterAll(async () => {
    const conn = getConnection()
    if (conn.isConnected) {
      await conn.close()
    }
  })

  beforeEach(() => {
    sut = new PgUserAccountRepository()
    backup.restore()
  })

  describe('load', () => {
    it('should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' })

      expect(account).toBeUndefined()
    })
  })
})
