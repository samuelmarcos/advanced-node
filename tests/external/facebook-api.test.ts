import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

/// REFATORAR TESTE QUANDO CONSEGUIR CRIAR USUÁRIO DE TESTE

describe('FacebookApi', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  })

  it('should return a Facebook User if token is valid', async () => {
    const fb_user = await sut.loadUser({ token: 'any_token' })

    expect(fb_user).toEqual({
      facebookId: 'any_id',
      name: 'any_name',
      email: 'any_email'
    })
  })

  it('should return a undefined if token is invalid', async () => {
    const fb_user = await sut.loadUser({ token: 'invalid' })

    expect(fb_user).toBeUndefined()
  })
})
