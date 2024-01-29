import { setupFacebookAthentication, type FacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi } from '../apis'
import { makePgUserAccount } from '../repos'
import { makeJWTokenGerator } from '../crypto'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAthentication(makeFacebookApi(), makePgUserAccount(), makeJWTokenGerator())
}
