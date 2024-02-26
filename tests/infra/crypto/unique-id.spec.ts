import { type UUIDGenerator } from '@/domain/contracts/gateways'

class UniqueId implements UUIDGenerator {
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

describe('UUIDHandler', () => {
  it('should call uuid.v4', async () => {
    const sut = new UniqueId(new Date(2021, 9, 3, 10, 10, 10))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20211004111111')
  })

  it('should call uuid.v4', async () => {
    const sut = new UniqueId(new Date(2021, 2, 10, 18, 1, 0))

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20210311190201')
  })
})
