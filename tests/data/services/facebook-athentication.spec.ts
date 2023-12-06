import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { FacebookAthenticationService } from '@/data/services'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAccount } from '@/domain/models'

import { mock, type MockProxy } from 'jest-mock-extended'
import { mocked } from 'jest-mock'

jest.mock('@/domain/models/facebook-account')

describe('Facebook Athentication Service', () => {
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>
  let sut: FacebookAthenticationService
  const token = 'any_token'

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_@email.com',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue = undefined
    sut = new FacebookAthenticationService(facebookApi, userAccountRepo)
  })

  it('shoud call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const authResult = await sut.perform({ token })
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
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
})
