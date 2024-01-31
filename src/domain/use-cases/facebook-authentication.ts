import { type LoadFacebookUserApi } from '@/domain/contracts/apis'
import { AuthenticationError } from '@/domain/entities/errors'
import { FacebookAccount, AccessToken } from '@/domain/entities'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/domain/contracts/repos'
import { type TokenGenerator } from '@/domain/contracts/crypto'

type Setup = (
  facebookApi: LoadFacebookUserApi,
  userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator
) => FacebookAuthentication

type Input = { token: string }
type OutPut = { accessToken: string }

export type FacebookAuthentication = (params: Input) => Promise<OutPut >

export const setupFacebookAthentication: Setup = (facebookApi, userAccountRepo, crypto) => async params => {
  const fbData = await facebookApi.loadUser(params)
  if (fbData !== undefined) {
    const accountData = await userAccountRepo.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
    const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
  throw new AuthenticationError()
}