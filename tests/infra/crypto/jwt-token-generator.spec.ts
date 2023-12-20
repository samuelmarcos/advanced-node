import { type TokenGenerator } from '@/data/contracts/crypto'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

class JsonTokenGenerator implements TokenGenerator {
  constructor (private readonly secret: string) {}

  public async generateToken (params: TokenGenerator.Params): Promise<string> {
    const expirationInSeconds = params.expirationInMs / 1000
    jwt.sign({ key: params.key }, this.secret, { expiresIn: expirationInSeconds })

    return 'any_token'
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JsonTokenGenerator
  let fakeJwt: jest.Mocked<typeof jwt>

  beforeEach(() => {
    sut = new JsonTokenGenerator('any_secret')
  })

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  it('should call sign with correct params', async () => {
    await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000
    })

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, 'any_secret', { expiresIn: 1 })
  })
})
