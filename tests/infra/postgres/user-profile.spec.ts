import { PgUser } from '@/infra/repos/postgres/entities'
import { getRepository, type Repository, getConnection } from 'typeorm'
import { PgUserProfileRepository } from '@/infra/repos/postgres'
import { makeFakeDB } from '@/tests/infra/postgres/mocks'

import { type IBackup } from 'pg-mem'

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository
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
    sut = new PgUserProfileRepository()
    backup.restore()
  })

  describe('savePicure', () => {
    it('should update user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_meail', initials: 'any_initials' })

      await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url' })
      const pgUser = await pgUserRepo.findOne({ id })

      expect(pgUser).toMatchObject({ id, pictureUrl: 'any_url', initials: null })
    })
  })

  describe('load', () => {
    it('should load user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_meail', name: 'any_name' })

      const userProfile = await sut.load({ id: id.toString() })

      expect(userProfile?.name).toBe('any_name')
    })
  })

  describe('load', () => {
    it('should return undefined', async () => {
      const userProfile = await sut.load({ id: '1' })

      expect(userProfile?.name).toBeUndefined()
    })
  })
})
