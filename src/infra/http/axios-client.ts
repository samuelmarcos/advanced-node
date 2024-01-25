import { type HttpGetClient } from '@/infra/http'
import axios from 'axios'

type Params = HttpGetClient.Params

export class AxiosHttpClient implements HttpGetClient {
  public async get <T = any> ({ params, url }: Params): Promise<T> {
    const result = await axios.get(url, { params })
    return result.data
  }
}
