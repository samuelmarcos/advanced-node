import { PgUser } from './entities'
import { type LoadUserProfile, type SaveUserPicture } from '@/domain/contracts/repos'
import { PgRepository } from './repository'

export class PgUserProfileRepository extends PgRepository implements SaveUserPicture {
  public async savePicture ({ id, pictureUrl, initials }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepo = this.getRepository(PgUser)

    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }

  public async load ({ id }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const pgUserRepo = this.getRepository(PgUser)

    const pgUser = await pgUserRepo.findOne({ id: parseInt(id) })
    if (pgUser !== undefined) return { name: pgUser.name ?? undefined }
  }
}
