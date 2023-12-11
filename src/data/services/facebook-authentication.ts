import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { FacebookAccount, AccessToken } from '@/domain/models'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'
import { type TokenGenerator } from '@/data/contracts/crypto'

export class FacebookAthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly unserAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator) {}

  public async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result | AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.unserAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.unserAccountRepo.saveWithFromFacebook(fbAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }

    return new AuthenticationError()
  }
}
