import { Controller } from '@/application/controllers'
import { type DbTransaction } from '@/application/contracts'
import { type HttpResponse } from '@/application/helpers'

export class DbTransactionController extends Controller {
  constructor (private readonly decoratee: Controller,
    private readonly db: DbTransaction) {
    super()
  }

  public async perform (httpRequest: any): Promise<HttpResponse> {
    try {
      await this.db.openTransaction()
      const httpResponse = await this.decoratee.perform(httpRequest)
      await this.db.commit()
      return httpResponse
    } catch (error) {
      await this.db.rollback()
      throw error
    } finally {
      await this.db.closeTransaction()
    }
  }
}
