import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('FacebookApi', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fb_user = await sut.loadUser({ token: 'any_token' })

    expect(fb_user).toEqual({
      facebookId: 'any_id',
      name: 'any_name',
      email: 'any_email'
    })
  })

  it('should return a undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)

    const fb_user = await sut.loadUser({ token: 'invalid' })

    expect(fb_user).toBeUndefined()
  })
})
