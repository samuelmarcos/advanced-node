import { type FacebookAuthentication } from '@/domain/features'
import { type LoadFacebookUserApi } from '@/domain/contracts/apis'
import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookAccount, AccessToken } from '@/domain/entities'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/domain/contracts/repos'
import { type TokenGenerator } from '@/domain/contracts/crypto'

export class FacebookAthenticationUseCase implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly unserAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  public async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result | AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.unserAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.unserAccountRepo.saveWithFacebook(fbAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}
