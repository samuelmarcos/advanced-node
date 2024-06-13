import { UniqueId } from '@/infra/gateways'

import { set, reset } from 'mockdate'

describe('UUIDHandler', () => {
  let sut: UniqueId

  beforeAll(() => {
    set(new Date(2021, 9, 3, 10, 10, 10))
  })

  beforeEach(() => {
    sut = new UniqueId()
  })

  afterAll(() => {
    reset()
  })

  it('should create a unique id', async () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_20211004111111')
  })
})
