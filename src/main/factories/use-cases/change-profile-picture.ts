import { type ChangeProfilePicture, setupChangeProfilePicure } from '@/domain/use-cases'
import { makeAwsS3FileStorage, makeUniqueId } from '../gateways'
import { makePgUserProfileRepo } from '../repos/postgress'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicure(makeAwsS3FileStorage(), makeUniqueId(), makePgUserProfileRepo())
}
