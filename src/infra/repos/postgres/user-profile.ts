import { getRepository } from 'typeorm'
import { PgUser } from './entities'
import { type SaveUserPicture } from '@/domain/contracts/repos'

export class PgUserProfileRepository implements SaveUserPicture {
  public async savePicture ({ id, pictureUrl, initials }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepo = getRepository(PgUser)

    await pgUserRepo.update({ id: parseInt(id) }, { pictureUrl, initials })
  }
}
