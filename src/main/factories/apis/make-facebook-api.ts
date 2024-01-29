import { FacebookApi } from '@/infra/apis'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '../http/axios-http'
import { type LoadFacebookUserApi } from '@/domain/contracts/apis'

export const makeFacebookApi = (): LoadFacebookUserApi => {
  const axiosClient = makeAxiosHttpClient()
  return new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
}
