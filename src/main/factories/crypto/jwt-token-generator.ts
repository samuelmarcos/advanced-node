import { env } from '@/main/config/env'
import { JwtTokenHandler } from '@/infra/crypto'

export const makeJWTokenGerator = (): JwtTokenHandler => {
  return new JwtTokenHandler(env.jwtSecret)
}
