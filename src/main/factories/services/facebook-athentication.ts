import { FacebookAthenticationService } from '@/domain/services'
import { makeFacebookApi } from '../apis'
import { makePgUserAccount } from '../repos'
import { makeJWTHenerator } from '../crypto'

export const makeFacebookAuthenticationService = (): FacebookAthenticationService => {
  const fbApi = makeFacebookApi()
  const unserPgUserAccountRepo = makePgUserAccount()
  const jwtTokenGenerator = makeJWTHenerator()
  return new FacebookAthenticationService(fbApi, unserPgUserAccountRepo, jwtTokenGenerator)
}
