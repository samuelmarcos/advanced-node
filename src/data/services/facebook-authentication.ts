import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { type AccessToken } from '@/domain/models'
import { type UpdateFacebookAccountRepository, type CreateFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'

export class FacebookAthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly unserAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository) {}

  public async perform (params: FacebookAuthentication.Params): Promise<AccessToken | AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.unserAccountRepo.load({ email: fbData.email })
      if (accountData?.name !== undefined) {
        await this.unserAccountRepo.updateWithFacebook({ id: accountData.id, name: accountData.name, facebookId: fbData.facebookId })
      } else {
        await this.unserAccountRepo.createFromFacebook(fbData)
      }
    }

    return new AuthenticationError()
  }
}
