import { type UUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements UUIDGenerator {
  constructor (private readonly date: Date) {}

  public uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return key +
    '_' +
    (this.date.getFullYear()).toString() +
   (this.date.getMonth() + 1).toString().padStart(2, '0') +
   (this.date.getDate() + 1).toString().padStart(2, '0') +
   (this.date.getHours() + 1).toString().padStart(2, '0') +
   (this.date.getMinutes() + 1).toString().padStart(2, '0') +
   (this.date.getSeconds() + 1).toString().padStart(2, '0')
  }
}
