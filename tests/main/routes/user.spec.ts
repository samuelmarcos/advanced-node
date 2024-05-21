import { app } from '@/main/config/app'
import { makeFakeDB } from '@/tests/infra/postgres/mocks'
import { UnauthorizedError } from '@/application/errors'

import { getConnection } from 'typeorm'
import { type IBackup } from 'pg-mem'
import request from 'supertest'

describe('UserRoutes', () => {
  describe('DELETE /users/picture', () => {
    let backup: IBackup

    beforeAll(async () => {
      const db = await makeFakeDB()
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
  })
})
