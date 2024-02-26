import { AxiosHttpClient, type HttpGetClient } from '@/infra/gateways'

export const makeAxiosHttpClient = (): HttpGetClient => {
  return new AxiosHttpClient()
}
