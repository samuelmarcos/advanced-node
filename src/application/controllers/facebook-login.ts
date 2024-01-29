import { unauthorized, type HttpResponse, ok } from '@/application/helpers'
import { AccessToken } from '@/domain/entities'
import { ValidationBuilder as Builder, type Validator } from '@/application/validation'
import { Controller } from './controller'
import { type FacebookAuthentication } from '@/domain/use-cases'

type HttpRequest = { token: string | undefined | null }

type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  public async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication({ token: token! })

    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return Builder
      .of({ value: token!, fieldName: 'token' })
      .required()
      .build()
  }
}
