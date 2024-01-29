import { AccessToken } from '@/domain/entities'
import { FacebookLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'

jest.mock('@/application/validation/composite')

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: jest.Mock

  beforeAll(() => {
    facebookAuth = jest.fn()

    facebookAuth.mockResolvedValue(new AccessToken('any_value'))
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('shoud build Validators correctly', async () => {
    const validators = sut.buildValidators({ token: 'any_token' })

    expect(validators).toEqual([new RequiredStringValidator('any_token', 'token')])
  })

  it('shoud call FacebookAuthentication with correct params', async () => {
    const sut = new FacebookLoginController(facebookAuth)

    await sut.handle({ token: 'any_token' })

    expect(facebookAuth).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })

  it('shoud return 401 if authentication fails', async () => {
    facebookAuth.mockResolvedValueOnce(new UnauthorizedError())

    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('shoud return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_token' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
