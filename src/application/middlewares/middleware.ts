import { type HttpResponse } from '../helpers'

export interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
