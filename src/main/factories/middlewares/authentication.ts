import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJWTokenHandler } from '@/main/factories/gateways'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJWTokenHandler()
  // passando com bind, será passado uma instância do this e não perdera as propriedades ao ser passado como função
  return new AuthenticationMiddleware(jwt.validate.bind(jwt))
}
