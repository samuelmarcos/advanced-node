import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { FacebookAthenticationService } from '@/data/services'
import { mock } from 'jest-mock-extended'

const loadFacebookUserSpy = mock<LoadFacebookUserApi>()

describe('Facebook Athentication Service', () => {
  it('shoud call LoadFacebookUserApi with correct params', async () => {
    const sut = new FacebookAthenticationService(loadFacebookUserSpy)
    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserSpy.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadFacebookUserSpy.loadUser).toHaveBeenCalledTimes(1)
  })

  it('shoud return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    const sut = new FacebookAthenticationService(loadFacebookUserSpy)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
