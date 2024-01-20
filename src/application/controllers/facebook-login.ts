import { unauthorized, type HttpResponse, ok } from '@/application/helpers'
import { type FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { ValidationBuilder as Builder, type Validator } from '@/application/validation'
import { Controller } from './controller'

type HttpRequest = {
  token: string | undefined | null
}

type Model = Error | {
  accessToken: string
}

export class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  public async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token! })

    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  override buildValidators (httpRequest: HttpRequest): Validator[] {
    return Builder
      .of({ value: httpRequest.token!, fieldName: 'token' })
      .required()
      .build()
  }
}
