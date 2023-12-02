import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { type AccessToken } from '@/domain/models'
import { type CreateFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'

export class FacebookAthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly unserAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository) {}

  public async perform (params: FacebookAuthentication.Params): Promise<AccessToken | AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      await this.unserAccountRepo.load({ email: fbData.email })
      await this.unserAccountRepo.createFromFacebook(fbData)
    }

    return new AuthenticationError()
  }
}
