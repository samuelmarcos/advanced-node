import { env } from '@/main/config/env'
import { JwtTokenHandler } from '@/infra/gateways'

export const makeJWTokenHandler = (): JwtTokenHandler => {
  return new JwtTokenHandler(env.jwtSecret)
}
