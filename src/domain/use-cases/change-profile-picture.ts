import { type UploadFile, type UUIDGenerator } from '@/domain/contracts/gateways'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicure: Setup = (fileStorage, crypto) => async ({ id, file }) => {
  if (file !== undefined) {
    await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
  }
}
