export class ConnectionNotFoundError extends Error {
  constructor () {
    super('No connection has been found')
    this.name = 'ConnectionNotFoundError'
  }
}

export class TransactionNotFoundError extends Error {
  constructor () {
    super('No transaction has been found')
    this.name = 'TransactionNotFoundError'
  }
}
