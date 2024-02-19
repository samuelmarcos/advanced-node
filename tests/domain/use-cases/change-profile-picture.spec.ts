import { mock } from 'jest-mock-extended'

type Setup = (fileStorage: UploadFile) => ChangeProfilePicure
type Input = { id: string, file: Buffer }
type ChangeProfilePicure = (input: Input) => Promise<void>

const setupChangeProfilePicure: Setup = (fileStorage) => async ({ id, file }) => {
  await fileStorage.upload({ file, key: id })
}

interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>
}

namespace UploadFile {
  export type Input = { file: Buffer, key: string }
}

describe('ChangeProfilePicture', () => {
  it('should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer')
    const fileStorage = mock<UploadFile>()
    const sut = setupChangeProfilePicure(fileStorage)

    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
