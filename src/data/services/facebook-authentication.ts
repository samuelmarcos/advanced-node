import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount, type AccessToken } from '@/domain/models'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'

export class FacebookAthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly unserAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository) {}

  public async perform (params: FacebookAuthentication.Params): Promise<AccessToken | AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.unserAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      await this.unserAccountRepo.saveWithFromFacebook(fbAccount)
    }

    return new AuthenticationError()
  }
}
