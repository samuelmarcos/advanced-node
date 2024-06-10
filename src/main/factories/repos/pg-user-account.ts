import { PgUserAccountRepository } from '@/infra/repos/postgres'
import { PgConnection } from '@/infra/repos/postgres/helpers'

export const makePgUserAccount = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
