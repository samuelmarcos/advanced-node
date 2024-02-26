import { type UUIDGenerator } from '@/domain/contracts/gateways'
import { mocked } from 'jest-mock'
import { v4 } from 'uuid'

jest.mock('uuid')

class UUIHandler {
  public uuid ({ key }: UUIDGenerator.Input): UUIDGenerator.Output {
    return `${key}_${v4()}`
  }
}

describe('UUIDHandler', () => {
  it('should call uuid.v4', async () => {
    const sut = new UUIHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('should return correct uuid', async () => {
    mocked(v4).mockReturnValueOnce('any_uuid')
    const sut = new UUIHandler()

    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
