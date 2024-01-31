import jwt from 'jsonwebtoken'
import { JwtTokenHandler } from '@/infra/crypto'

jest.mock('jsonwebtoken')

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtTokenHandler('any_secret')
  })

  describe('GenerateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({
        key,
        expirationInMs
      })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    it('should return a token', async () => {
      const generatedToken = await sut.generateToken({
        key,
        expirationInMs
      })

      expect(generatedToken).toBe(token)
    })

    it('should rethrow if jwt get throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('any_jwt_error') })

      const promise = sut.generateToken({
        key,
        expirationInMs: 1000
      })

      await expect(promise).rejects.toThrow(new Error('any_jwt_error'))
    })
  })

  describe('GenerateToken', () => {
    let key: string
    let token: string
    let expirationInMs: number

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      expirationInMs = 1000
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct params', async () => {
      await sut.generateToken({
        key,
        expirationInMs
      })

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 })
    })

    it('should return a token', async () => {
      const generatedToken = await sut.generateToken({
        key,
        expirationInMs
      })

      expect(generatedToken).toBe(token)
    })

    it('should rethrow if jwt get throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => { throw new Error('any_jwt_error') })

      const promise = sut.generateToken({
        key,
        expirationInMs: 1000
      })

      await expect(promise).rejects.toThrow(new Error('any_jwt_error'))
    })
  })
})
