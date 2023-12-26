import jwt from 'jsonwebtoken'
import { JwtTokenGenerator } from '@/infra/crypto'

jest.mock('jsonwebtoken')

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret')
  })

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>

    fakeJwt.sign.mockImplementation(() => 'any_token')
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })

  it('should return a token', async () => {
    const token = await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(token).toBe('any_token')
  })

  it('should rethrow if jwt get throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => { throw new Error('any_jwt_error') })

    const promise = sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    await expect(promise).rejects.toThrow(new Error('any_jwt_error'))
  })
})