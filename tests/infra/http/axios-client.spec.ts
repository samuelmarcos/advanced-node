import { type HttpGetClient } from '@/infra/http'
import axios from 'axios'

jest.mock('axios')

export class AxiosHttpClient implements HttpGetClient {
  public async get <T = any> (params: HttpGetClient.Params): Promise<T> {
    const result = await axios.get(params.url, { params: params.params })
    return result.data
  }
}

describe('AxiosHttpClient', () => {
  describe('get', () => {
    let sut: AxiosHttpClient
    let fakeAxios: jest.Mocked<typeof axios>
    let url: string
    let params: object

    beforeAll(() => {
      url = 'any_url'
      params = {
        any: 'any'
      }
      fakeAxios = axios as jest.Mocked<typeof axios>
      fakeAxios.get.mockResolvedValue({
        status: 200,
        data: 'any_data'
      })
    })

    beforeEach(() => {
      sut = new AxiosHttpClient()
    })

    test('should call with correct params', async () => {
      await sut.get({ url, params })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', { params })
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })

    test('should return data on success', async () => {
      const result = await sut.get({ url, params })

      expect(result).toEqual('any_data')
      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
