import { type Controller } from '@/application/controllers'

export interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
}

export class DbTransactionController {
  constructor (private readonly decoratee: Controller,
    private readonly db: DbTransaction) {}

  public async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
    await this.decoratee.perform(httpRequest)
    await this.db.commit()
    await this.db.closeTransaction()
  }
}
