import { type Request, type Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { type MockProxy, mock } from 'jest-mock-extended'
import { type Controller } from '@/application/controllers'

class ExpressRouter {
  constructor (private readonly controller: Controller) {}
  public async adapt (req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body })
  }
}

describe('Express Router', () => {
  let req: Request
  let res: Response
  let sut: ExpressRouter
  let controller: MockProxy<Controller>
  beforeEach(() => {
    controller = mock()
    sut = new ExpressRouter(controller)
    req = getMockReq({ body: { any: 'any' } })
    res = getMockRes().res
  })
  it('should call handle with correct request', async () => {
    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call handle with amepty request', async () => {
    req = getMockReq({ body: undefined })

    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({})
  })
})
