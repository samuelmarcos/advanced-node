import { PgUser } from './entities'
import { type SaveFacebookAccount, type LoadUserAccount } from '@/domain/contracts/repos'
import { PgRepository } from './repository'

type LoadInput = LoadUserAccount.Input
type LoadOutput = LoadUserAccount.Output
type SaveInput = SaveFacebookAccount.Input
type SaveOutput = SaveFacebookAccount.Output

export class PgUserAccountRepository extends PgRepository implements LoadUserAccount, SaveFacebookAccount {
  public async load ({ email }: LoadInput): Promise<LoadOutput> {
    const pgUserRepo = this.getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })

    if (pgUser !== undefined) {
      const id = pgUser.id.toString()
      return { id, name: pgUser.name ?? undefined }
    }
  }

  public async saveWithFacebook ({ email, facebookId, name, id }: SaveInput): Promise<SaveOutput> {
    const pgUserRepo = this.getRepository(PgUser)
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
