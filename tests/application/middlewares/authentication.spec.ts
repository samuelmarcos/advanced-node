import { forbidden, type HttpResponse } from '@/application/helpers'
import { ForbiddenError } from '@/application/errors'
import { RequiredStringValidator } from '@/application/validation'
import { type Authorize } from '@/domain/use-cases'

type HttpRequest = {
  authorization: string
}

class AuthenticationMiddleware {
  constructor (private readonly authorize: Authorize) {}

  public async handle ({ authorization }: HttpRequest): Promise<HttpResponse | undefined> {
    try {
      const error = new RequiredStringValidator(authorization, 'authorization').validate()
      if (error !== undefined) return forbidden()
      await this.authorize({ token: authorization })
    } catch {
      return forbidden()
    }
  }
}

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware
  let authorize: jest.Mock
  let authorization: string

  beforeAll(() => {
    authorization = 'any_authorization'
    authorize = jest.fn()
  })

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize)
  })

  it('shoud return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('shoud return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('shoud return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  it('shoud call authorize with correct input', async () => {
    await sut.handle({ authorization })

    expect(authorize).toHaveBeenCalledWith({ token: authorization })
  })

  it('shoud return 403 if authorize throws', async () => {
    authorize.mockRejectedValueOnce(new Error('any_error'))
    await sut.handle({ authorization })

    expect(authorize).toHaveBeenCalledWith({ token: authorization })
  })

  it('shoud return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})
