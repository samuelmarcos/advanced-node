import { mock, type MockProxy } from 'jest-mock-extended'
import { type TokenValidator } from '@/domain/contracts/crypto'
import { setupAuthorize, type Authorize } from '@/domain/use-cases'

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_id')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('shoud call TokenValidator with correct params', async () => {
    await sut({ token })
    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  it('shoud return the correct accessToken', async () => {
    const userId = await sut({ token })
    expect(userId).toBe('any_id')
  })
})
