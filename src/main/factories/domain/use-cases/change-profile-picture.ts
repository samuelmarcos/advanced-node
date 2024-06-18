import { type ChangeProfilePicture, setupChangeProfilePicure } from '@/domain/use-cases'
import { makeAwsS3FileStorage, makeUniqueId } from '@/main/factories/infra/gateways'
import { makePgUserProfileRepo } from '@/main/factories/infra/repos/postgress'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicure(makeAwsS3FileStorage(), makeUniqueId(), makePgUserProfileRepo())
}
