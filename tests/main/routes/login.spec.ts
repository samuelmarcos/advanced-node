import { app } from '@/main/config/app'
import { makeFakeDB } from '@/tests/infra/postgres/mocks'
import { UnauthorizedError } from '@/application/errors'
import { PgConnection } from '@/infra/repos/postgres/helpers'

import { type IBackup } from 'pg-mem'
import request from 'supertest'

describe('LoginRoutes', () => {
  let connection: PgConnection

  describe('POST /login/facebook', () => {
    const laodUserSpy = jest.fn()

    jest.mock('@/infra/gateways/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: laodUserSpy
      })
    }))

    let backup: IBackup

    beforeAll(async () => {
      connection = PgConnection.getInstance()
      const db = await makeFakeDB()
      backup = db.backup()
    })

    afterAll(async () => {
      await connection.disconnect()
    })

    beforeEach(() => {
      backup.restore()
    })

    it('should return 200 with access token', async () => {
      laodUserSpy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body).toBeDefined()
    })

    it('should return 401 with UnauthorizedError error', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
