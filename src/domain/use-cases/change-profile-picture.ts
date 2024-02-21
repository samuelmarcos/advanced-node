import { type UploadFile, type UUIDGenerator, type DeleteFile } from '@/domain/contracts/gateways'
import { type SaveUserPicture, type LoadUserProfile } from '@/domain/contracts/repos'
import { UserProfile } from '../entities'

type Setup = (fileStorage: UploadFile & DeleteFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
type Output = { pictureUrl?: string, initials?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicure: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  const key = crypto.uuid({ key: id })
  const data = {
    pictureUrl: file !== undefined ? await fileStorage.upload({ file, key }) : undefined,
    name: file === undefined ? (await userProfileRepo.load({ id })).name : undefined
  }
  const userProfile = new UserProfile(id)
  userProfile.setPicture(data)
  try {
    await userProfileRepo.savePicture(userProfile)
  } catch {
    if (file !== undefined) await fileStorage.delete({ key })
    throw new Error()
  }
  return userProfile
}
