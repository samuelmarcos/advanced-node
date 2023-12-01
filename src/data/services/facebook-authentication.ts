import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis/facebook'
import { AuthenticationError } from '@/domain/errors'
import { type AccessToken } from '@/domain/models'

export class FacebookAthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserTokenApi: LoadFacebookUserApi) {}
  async perform (params: FacebookAuthentication.Params): Promise<AccessToken | AuthenticationError> {
    await this.loadFacebookUserTokenApi.loadUser(params)
    return new AuthenticationError()
  }
}
