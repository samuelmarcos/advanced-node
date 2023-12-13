import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAthenticationService } from '@/data/services'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { type TokenGenerator } from '@/data/contracts/crypto'

import { mock, type MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'

jest.mock('@/domain/models/facebook-account')

describe('Facebook Athentication Service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAthenticationService
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_@email.com',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFromFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generateToken.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = new FacebookAthenticationService(
      facebookApi,
      userAccountRepo,
      crypto
    )
  })

  it('shoud call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('shoud call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token })
    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_@email.com' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('shoud call SaveFacebookAccountRepository with facebook account', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => {
      return {}
    })
    mocked(FacebookAccount).mockImplementation(facebookAccountStub)

    await sut.perform({ token })
    expect(userAccountRepo.saveWithFromFacebook).toHaveBeenCalledWith({})
    expect(userAccountRepo.saveWithFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('shoud call TokenGenerator with correct params', async () => {
    await sut.perform({ token })
    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generateToken).toHaveBeenCalledTimes(1)
  })

  it('shoud return an AccessToken on success', async () => {
    const authResult = await sut.perform({ token })
    expect(authResult).toEqual(new AccessToken('any_generated_token'))
  })

  it('shoud rethrow if LoadFacebookUserApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_errror'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('fb_errror'))
  })

  it('shoud rethrow if LoadFacebookUserApi throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_errror'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('load_errror'))
  })

  it('shoud rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFromFacebook.mockRejectedValueOnce(new Error('save_error'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('shoud rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'))
    const promise = sut.perform({ token })
    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
