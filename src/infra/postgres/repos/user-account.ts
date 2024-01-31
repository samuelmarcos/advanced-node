import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/domain/contracts/repos'

type LoadInput = LoadUserAccountRepository.Input
type LoadOutput = LoadUserAccountRepository.Output
type SaveInput = SaveFacebookAccountRepository.Input
type SaveOutput = SaveFacebookAccountRepository.Output

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  public async load ({ email }: LoadInput): Promise<LoadOutput> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })

    if (pgUser !== undefined) {
      const id = pgUser.id.toString()
      return { id, name: pgUser.name ?? undefined }
    }
  }

  public async saveWithFacebook ({ email, facebookId, name, id }: SaveInput): Promise<SaveOutput> {
    const pgUserRepo = getRepository(PgUser)
    let resultId: string
    if (id === undefined) {
      const pgUser = await pgUserRepo.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id!
      await pgUserRepo.update({
        id: parseInt(id)
      }, { name, facebookId })
    }

    return { id: resultId }
  }
}
