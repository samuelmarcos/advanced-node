import { setupFacebookAthentication, type FacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi, makeJWTokenHandler } from '../gateways'
import { makePgUserAccount } from '../repos'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAthentication(makeFacebookApi(), makePgUserAccount(), makeJWTokenHandler())
}
