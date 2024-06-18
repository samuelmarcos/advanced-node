import { type Controller } from '@/application/controllers'

export interface DbTransaction {
  openTransaction: () => Promise<void>
}

export class DbTransactionController {
  constructor (private readonly decoratee: Controller,
    private readonly db: DbTransaction) {}

  public async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    await this.decoratee.perform(httpRequest)
  }
}
