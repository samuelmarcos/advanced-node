import { type MockProxy, mock } from 'jest-mock-extended'
import { type UUIDGenerator, type UploadFile } from '@/domain/contracts/gateways'
import { setupChangeProfilePicure, type ChangeProfilePicture } from '@/domain/use-cases/change-profile-picture'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicure(fileStorage, crypto)
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ file, id: 'any_id' })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_unique_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
