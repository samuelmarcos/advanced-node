import { type RequestHandler, type Request, type Response, type NextFunction } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type MockProxy, mock } from 'jest-mock-extended'
import { adaptExpressMiddleware } from '@/main/adapters'
import { type Middleware } from '@/application/middlewares'

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
    middleware.handle.mockResolvedValue({
      statusCode: 200,
      data: { prop: 'any_value', nullProp: null, undefinedProp: undefined }
    })
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

  it('shoud call respond with correct and status code', async () => {
    middleware.handle.mockResolvedValueOnce({
      statusCode: 500,
      data: new Error('any_error')
    })
    await sut(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.status).toHaveBeenCalledTimes(1)
    expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
    expect(res.status).toHaveBeenCalledTimes(1)
  })

  it('shoud add valid data to req.locals', async () => {
    await sut(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(req.locals).toEqual({ prop: 'any_value' })
  })
})
