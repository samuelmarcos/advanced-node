import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveParams = SaveFacebookAccountRepository.Params
type SaveResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  public async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepo.findOne({ where: { email } })

    if (pgUser !== undefined) {
      const id = pgUser.id.toString()
      return {
        id,
        name: pgUser.name ?? undefined
      }
    }
  }

  public async saveWithFacebook ({ email, facebookId, name, id }: SaveParams): Promise<SaveResult> {
    let resultId: string
    if (id === undefined) {
      const pgUser = await this.pgUserRepo.save({ email, name, facebookId })
      resultId = pgUser.id.toString()
    } else {
      resultId = id!
      await this.pgUserRepo.update({
        id: parseInt(id)
      }, { name, facebookId })
    }

    return { id: resultId }
  }
}
