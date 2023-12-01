import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { FacebookAthenticationService } from '@/data/services'
import { mock, type MockProxy } from 'jest-mock-extended'

describe('Facebook Athentication Service', () => {
  let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>
  let sut: FacebookAthenticationService

  beforeEach(() => {
    loadFacebookUserApi = mock()
    sut = new FacebookAthenticationService(loadFacebookUserApi)
  })

  it('shoud call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const authResult = await sut.perform({ token: 'any_token' })
    loadFacebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    expect(authResult).toEqual(new AuthenticationError())
  })
})
