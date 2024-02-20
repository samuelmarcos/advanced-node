import { type UploadFile, type UUIDGenerator } from '@/domain/contracts/gateways'
import { type SaveUserPicture } from '@/domain/contracts/repos'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicure: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  if (file !== undefined) {
    const pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
    await userProfileRepo.savePicture({ pictureUrl })
  }
}