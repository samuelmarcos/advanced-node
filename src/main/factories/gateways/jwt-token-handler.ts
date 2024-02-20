import { env } from '@/main/config/env'
import { JwtTokenHandler } from '@/infra/crypto'

export const makeJWTokenHandler = (): JwtTokenHandler => {
  return new JwtTokenHandler(env.jwtSecret)
}
