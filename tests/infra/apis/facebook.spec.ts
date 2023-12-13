import { type LoadFacebookUserApi } from '@/data/contracts/apis'
import { mock } from 'jest-mock-extended'

export class FacebookApi implements LoadFacebookUserApi {
  private readonly baseUrl = 'https://graph.facebook.com'

  constructor (private readonly httpClient: HttpGetClient) {}

  public async loadUser (params: LoadFacebookUserApi.Params): Promise<LoadFacebookUserApi.Result> {
    await this.httpClient.get({ url: `${this.baseUrl}/oauth/access_token` })

    return null
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

export namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

describe('FacebookApi', () => {
  it('shoud get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient)
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token'
    })
  })
})
