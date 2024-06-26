import { app } from '@/main/config/app'
import { makeFakeDB } from '@/tests/infra/postgres/mocks'
import { PgConnection } from '@/infra/repos/postgres/helpers'

import { type Repository, getConnection, getRepository } from 'typeorm'
import { type IBackup } from 'pg-mem'
import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { PgUser } from '@/infra/repos/postgres/entities'
import { env } from '@/main/config/env'

describe('UserRoutes', () => {
  let connection: PgConnection
  let backup: IBackup
  let pgUserRepo: Repository<PgUser>

  beforeAll(async () => {
    connection = PgConnection.getInstance()
    const db = await makeFakeDB()
    pgUserRepo = getRepository(PgUser)
    backup = db.backup()
  })

  afterAll(async () => {
    await connection.disconnect()
  })

  beforeEach(() => {
    backup.restore()
  })

  describe('DELETE /users/picture', () => {
    it('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .delete('/api/users/picture')

      expect(status).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_meail', name: 'Samuel Marcos' })
      const authorization: string = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: undefined, initials: 'SM' })
    })
  })

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn()

    jest.mock('@/infra/gateways/aws-s3-file-storage', () => ({
      AwsS3FileSotrage: jest.fn().mockReturnValue({
        upload: uploadSpy
      })
    }))

    it('should return 403 if no authorization header is present', async () => {
      const { status } = await request(app)
        .put('/api/users/picture')

      expect(status).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      uploadSpy.mockResolvedValueOnce('any_url')
      const { id } = await pgUserRepo.save({ email: 'any_meail', name: 'any_name' })
      const authorization: string = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), { filename: 'any_name', contentType: 'image/png' })

      expect(status).toBe(200)
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined })
    })
  })
})
