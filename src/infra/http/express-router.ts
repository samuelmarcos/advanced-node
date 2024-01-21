import { type Request, type Response } from 'express'
import { type Controller } from '@/application/controllers'

export class ExpressRouter {
  constructor (private readonly controller: Controller) {}
  public async adapt (req: Request, res: Response): Promise<void> {
    const httpResponse = await this.controller.handle({ ...req.body })
    if (httpResponse.statusCode === 200) {
      res.status(httpResponse.statusCode).json(httpResponse.data)
    } else {
      res.status(httpResponse.statusCode).json({ error: httpResponse.data.message })
    }
  }
}
