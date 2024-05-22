import { app } from '@/main/config/app'
import { makeFakeDB } from '@/tests/infra/postgres/mocks'

import { type Repository, getConnection, getRepository } from 'typeorm'
import { type IBackup } from 'pg-mem'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { PgUser } from '@/infra/repos/postgres/entities'
import { env } from '@/main/config/env'

describe('UserRoutes', () => {
  describe('DELETE /users/picture', () => {
    let backup: IBackup
    let pgUserRepo: Repository<PgUser>

    beforeAll(async () => {
      const db = await makeFakeDB()
      pgUserRepo = getRepository(PgUser)
      backup = db.backup()
    })

    afterAll(async () => {
      const conn = getConnection()
      if (conn.isConnected) {
        await conn.close()
      }
    })

    beforeEach(() => {
      backup.restore()
    })

    it('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/picture')

      expect(status).toBe(403)
    })

    it('should return 204', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_meail' })
      const authorization: string = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(status).toBe(204)
      expect(body).toEqual({})
    })
  })
})
