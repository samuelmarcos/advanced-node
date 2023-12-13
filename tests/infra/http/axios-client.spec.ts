import { type HttpGetClient } from '@/infra/http'
import axios from 'axios'

jest.mock('axios')

export class AxiosHttpClient {
  public async get (params: HttpGetClient.Params): Promise<void> {
    await axios.get(params.url, { params: params.params })
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
    })

    beforeEach(() => {
      sut = new AxiosHttpClient()
    })

    test('should call with correct params', async () => {
      await sut.get({ url, params })

      expect(fakeAxios.get).toHaveBeenCalledWith('any_url', { params })

      expect(fakeAxios.get).toHaveBeenCalledTimes(1)
    })
  })
})
