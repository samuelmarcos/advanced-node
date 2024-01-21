import { type Request, type Response } from 'express'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { mock } from 'jest-mock-extended'
import { type Controller } from '@/application/controllers'

class ExpressRouter {
  constructor (private readonly controller: Controller) {}
  public async adapt (req: Request, res: Response): Promise<void> {
    await this.controller.handle({ ...req.body })
  }
}

describe('Express Router', () => {
  it('should call handle with correct request', async () => {
    const controller = mock<Controller>()
    const sut = new ExpressRouter(controller)

    const req = getMockReq({ body: { any: 'any' } })
    const { res } = getMockRes()

    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' })
  })

  it('should call handle with amepty request', async () => {
    const controller = mock<Controller>()
    const sut = new ExpressRouter(controller)

    const req = getMockReq()
    const { res } = getMockRes()

    await sut.adapt(req, res)

    expect(controller.handle).toHaveBeenCalledWith({})
  })
})
