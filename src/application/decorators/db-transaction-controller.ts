import { type Controller } from '@/application/controllers'

export interface DbTransaction {
  openTransaction: () => Promise<void>
  closeTransaction: () => Promise<void>
  commit: () => Promise<void>
  rollback: () => Promise<void>
}

export class DbTransactionController {
  constructor (private readonly decoratee: Controller,
    private readonly db: DbTransaction) {}

  public async perform (httpRequest: any): Promise<void> {
    try {
      await this.db.openTransaction()
      await this.decoratee.perform(httpRequest)
      await this.db.commit()
      await this.db.closeTransaction()
    } catch {
      await this.db.rollback()
      await this.db.closeTransaction()
    }
  }
}
