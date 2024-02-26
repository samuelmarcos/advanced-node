import { UniqueId } from '@/infra/gateways'

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
