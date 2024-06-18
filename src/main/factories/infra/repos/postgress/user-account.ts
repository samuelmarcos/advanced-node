import { PgUserAccountRepository } from '@/infra/repos/postgres'

export const makePgUserAccount = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
