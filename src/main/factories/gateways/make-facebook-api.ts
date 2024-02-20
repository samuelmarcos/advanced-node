import { FacebookApi } from '@/infra/apis'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '../http/axios-http'
import { type LoadFacebookUser } from '@/domain/contracts/gateways'

export const makeFacebookApi = (): LoadFacebookUser => {
  const axiosClient = makeAxiosHttpClient()
  return new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
}
