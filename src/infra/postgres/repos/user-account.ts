import { getRepository } from 'typeorm'
import { PgUser } from '@/infra/postgres/entities'
import { type LoadUserAccountRepository } from '@/data/contracts/repos'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  public async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser)

    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } })

    if (pgUser !== undefined) {
      const id = pgUser.id.toString()
      return {
        id,
        name: pgUser.name ?? undefined
      }
    }
  }
}
