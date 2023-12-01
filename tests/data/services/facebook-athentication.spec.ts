import { type AuthenticationError } from '@/domain/errors'
import { type FacebookAuthentication } from '@/domain/features'
import { type AccessToken } from '@/domain/models'

class FacebookAthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserTokenApi: LoadFacebookUserApi) {}
  async perform (params: FacebookAuthentication.Params): Promise<AccessToken | AuthenticationError> {
    await this.loadFacebookUserTokenApi.loadUserByToken(params)
    return Promise.resolve({ accessToken: 'any_token' })
  }
}

interface LoadFacebookUserApi {
  loadUserByToken: (params: LoadFacebookUserApi.Params) => Promise<void>
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string
  async loadUserByToken (params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token
  }
}

describe('Facebook Athentication Service', () => {
  test('shoud call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserSpy = new LoadFacebookUserApiSpy()
    const sut = new FacebookAthenticationService(loadFacebookUserSpy)

    await sut.perform({ token: 'any_token' })
    expect(loadFacebookUserSpy.token).toBe('any_token')
  })
})
