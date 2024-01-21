import { AxiosHttpClient, type HttpGetClient } from '@/infra/http'

export const makeAxiosHttpClient = (): HttpGetClient => {
  return new AxiosHttpClient()
}
