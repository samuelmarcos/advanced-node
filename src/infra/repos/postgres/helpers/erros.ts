export class ConnectionNotFoundError extends Error {
  constructor () {
    super('No connection has been found')
    this.name = 'ConnectionNotFoundError'
  }
}
