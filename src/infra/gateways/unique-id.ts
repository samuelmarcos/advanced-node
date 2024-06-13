import { type UUIDGenerator } from '@/domain/contracts/gateways'

export class UniqueId implements UUIDGenerator {
  public uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    const date = new Date()
    return key +
    '_' +
    (date.getFullYear()).toString() +
   (date.getMonth() + 1).toString().padStart(2, '0') +
   (date.getDate() + 1).toString().padStart(2, '0') +
   (date.getHours() + 1).toString().padStart(2, '0') +
   (date.getMinutes() + 1).toString().padStart(2, '0') +
   (date.getSeconds() + 1).toString().padStart(2, '0')
  }
}
