import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { type AccessToken } from '@/domain/models'
import { type LoadUserAccountRepository } from '@/data/contracts/repos'

export class FacebookAthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserTokenApi: LoadFacebookUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository) {}

  async perform (params: FacebookAuthentication.Params): Promise<AccessToken | AuthenticationError> {
    const fbData = await this.loadFacebookUserTokenApi.loadUser(params)
    if (fbData !== undefined) {
      await this.loadUserAccountRepo.load({ email: fbData.email })
    }
    return new AuthenticationError()
  }
}
