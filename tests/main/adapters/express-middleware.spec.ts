import { type RequestHandler, type Request, type Response, type NextFunction } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type HttpResponse } from '@/application/helpers'
import { type MockProxy, mock } from 'jest-mock-extended'

interface Middleware {
  handle: (httpRequest: any) => Promise<HttpResponse>
}

type Adapter = (middleware: Middleware) => RequestHandler

const adaptExpressMiddleware: Adapter = (middleware) => async (req, res, next) => {
  await middleware.handle({ ...req.headers })
}

describe('ExpressMiddleware', () => {
  let req: Request
  let res: Response
  let next: NextFunction
  let sut: RequestHandler
  let middleware: MockProxy<Middleware>

  beforeAll(() => {
    req = getMockReq({ headers: { any: 'any' } })
    res = getMockRes().res
    next = getMockRes().next
    middleware = mock()
  })

  beforeEach(() => {
    sut = adaptExpressMiddleware(middleware)
  })

  it('shoud call handle with correct request', async () => {
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ ...req.headers })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('shoud call handle with empty request', async () => {
    req = getMockReq({ headers: {} })
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })

  it('shoud call handle with empty request', async () => {
    req = getMockReq({ headers: {} })
    await sut(req, res, next)

    expect(middleware.handle).toHaveBeenCalledWith({ })
    expect(middleware.handle).toHaveBeenCalledTimes(1)
  })
})
