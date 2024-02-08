import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJWTokenGerator } from '@/main/factories/crypto'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJWTokenGerator()
  // passando com bind, será passado uma instância do this e não perdera as propriedades ao ser passado como função
  return new AuthenticationMiddleware(jwt.validateToken.bind(jwt))
}
