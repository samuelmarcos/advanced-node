import { type MockProxy, mock } from 'jest-mock-extended'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture
type Input = { id: string, file: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

const setupChangeProfilePicure: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
}

interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}

interface UUIDGenerator {
  uuid: (input: UUIDGenerator.Input) => UUIDGenerator.Output
}

namespace UUIDGenerator {
  export type Input = { key: string }
  export type Output = string
}

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
