import { setupFacebookAthentication, type FacebookAuthentication } from '@/domain/use-cases'
import { makeFacebookApi, makeJWTokenHandler } from '@/main/factories/infra/gateways'
import { makePgUserAccount } from '@/main/factories/infra/repos/postgress'

export const makeFacebookAuthentication = (): FacebookAuthentication => {
  return setupFacebookAthentication(makeFacebookApi(), makePgUserAccount(), makeJWTokenHandler())
}
