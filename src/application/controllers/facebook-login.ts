import { type HttpResponse } from '@/application/helpers'
import { type FacebookAuthentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { ServerError } from '@/application/errors'

export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  public async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' || httpRequest.token === null || httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('The field token is required')
        }
      }
      const result = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: { accessToken: result.value }
        }
      } else {
        return {
          statusCode: 401,
          data: result
        }
      }
    } catch (error) {
      return {
        statusCode: 500,
        data: new ServerError(error)
      }
    }
  }
}
