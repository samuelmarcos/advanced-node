import { AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { type AccessToken } from '@/domain/models'

class FacebookAthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserTokenApi: LoadFacebookUserApi) {}
  async perform (params: FacebookAuthentication.Params): Promise<AccessToken | AuthenticationError> {
    await this.loadFacebookUserTokenApi.loadUserByToken(params)
    return new AuthenticationError()
  }
}

interface LoadFacebookUserApi {
  loadUserByToken: (params: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined

}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  result = undefined
  async loadUserByToken (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    this.token = params.token
    return this.result
  }
}

describe('Facebook Athentication Service', () => {
  it('shoud call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAthenticationService(loadFacebookUserSpy)

    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserSpy.token).toBe('any_token')
  })

  it('shoud return AuthenticationError whenLoadFacebookUserApi returns undefined', async () => {
    const loadFacebookUserSpy = new LoadFacebookUserApiSpy()
    loadFacebookUserSpy.result = undefined
    const sut = new FacebookAthenticationService(loadFacebookUserSpy)

    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })
})
