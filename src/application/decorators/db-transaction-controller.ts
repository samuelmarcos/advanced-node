import { type Controller } from '@/application/controllers'
import { type HttpResponse } from '@/application/helpers'

export interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
  rollback: () => Promise<void>
}

export class DbTransactionController {
  constructor (private readonly decoratee: Controller,
    private readonly db: DbTransaction) {}

  public async perform (httpRequest: any): Promise<HttpResponse | undefined> {
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
