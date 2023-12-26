import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { type SaveFacebookAccountRepository, type LoadUserAccountRepository } from '@/data/contracts/repos'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  private readonly pgUserRepo = getRepository(PgUser)

  public async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({ where: { email: params.email } })

    if (pgUser !== undefined) {
      const id = pgUser.id.toString()
      return {
        id,
        name: pgUser.name ?? undefined
      }
    }
  }

  public async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    let id: string
    if (params.id === undefined) {
      const pgUser = await this.pgUserRepo.save(
        {
          email: params.email,
          name: params.name,
          facebookId: params.facebookId
        })

      id = pgUser.id.toString()
    } else {
      id = params.id
      await this.pgUserRepo.update({
        id: parseInt(params.id)
      }, {
        name: params.name,
        facebookId: params.facebookId
      })
    }

    return { id }
  }
}
