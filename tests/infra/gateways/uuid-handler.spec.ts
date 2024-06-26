import { mocked } from 'jest-mock'
import { v4 } from 'uuid'
import { UUIHandler } from '@/infra/gateways'

jest.mock('uuid')

describe('UUIDHandler', () => {
  let sut: UUIHandler

  beforeAll(() => {
    mocked(v4).mockReturnValue('any_uuid')
  })

  beforeEach(() => {
    sut = new UUIHandler()
  })

  it('should call uuid.v4', async () => {
    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })

  it('should return correct uuid', async () => {
    const uuid = sut.uuid({ key: 'any_key' })

    expect(uuid).toBe('any_key_any_uuid')
  })
})
