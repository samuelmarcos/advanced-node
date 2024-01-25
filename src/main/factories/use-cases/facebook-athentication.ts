import { FacebookAthenticationUseCase } from '@/domain/use-cases'
import { makeFacebookApi } from '../apis'
import { makePgUserAccount } from '../repos'
import { makeJWTHenerator } from '../crypto'

export const makeFacebookAuthentication = (): FacebookAthenticationUseCase => {
  const fbApi = makeFacebookApi()
  const unserPgUserAccountRepo = makePgUserAccount()
  const jwtTokenGenerator = makeJWTHenerator()
  return new FacebookAthenticationUseCase(fbApi, unserPgUserAccountRepo, jwtTokenGenerator)
}
