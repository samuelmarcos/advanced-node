import { PgUserAccountRepository } from '@/infra/postgres/repos'

export const makePgUserAccount = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
