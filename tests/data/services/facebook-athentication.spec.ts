import { AuthenticationError } from '@/domain/errors'
import { type LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { FacebookAthenticationService } from '@/data/services'

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined
  callsCount = 0
  async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('Facebook Athentication Service', () => {
  it('shoud call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAthenticationService(loadFacebookUserSpy)

    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserSpy.token).toBe('any_token')
    expect(loadFacebookUserSpy.callsCount).toBe(1)
  })

  it('shoud return AuthenticationError whenLoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserSpy = new LoadFacebookUserApiSpy()
    loadFacebookUserSpy.result = undefined
    const sut = new FacebookAthenticationService(loadFacebookUserSpy)

    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
