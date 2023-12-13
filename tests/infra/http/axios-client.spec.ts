import axios from 'axios'
import { AxiosHttpClient } from '@/infra/http'

jest.mock('axios')

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

    test('should rethrow if axios get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))
      const promise = sut.get({ url, params })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})
