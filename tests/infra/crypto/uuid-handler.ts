import { type UUIDGenerator } from '@/domain/contracts/gateways'
import { v4 } from 'uuid'

jest.mock('uuid')

class UUIHandler {
  public uuid ({ key }: UUIDGenerator.Input): void {
    v4()
  }
}

describe('UUIDHandler', () => {
  it('should call uuid.v4', async () => {
    const sut = new UUIHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
})
