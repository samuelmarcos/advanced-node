import { type HttpGetClient } from '@/infra/http'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  public async get <T = any> (params: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(params.url, { params: params.params })
    return result.data
  }
}
