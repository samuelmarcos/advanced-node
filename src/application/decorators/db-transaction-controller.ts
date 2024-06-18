export interface DbTransaction {
  openTransaction: () => Promise<void>
}

export class DbTransactionController {
  constructor (private readonly db: DbTransaction) {}

  public async perform (httpRequest: any): Promise<void> {
    await this.db.openTransaction()
  }
}
