import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  public async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })

    if (pgUser !== undefined) {
      const id = pgUser.id.toString()
      return { id, name: pgUser.name ?? undefined }
    }
  }

  public async saveWithFacebook ({ email, facebookId, name, id }: SaveParams): Promise<SaveResult> {
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
