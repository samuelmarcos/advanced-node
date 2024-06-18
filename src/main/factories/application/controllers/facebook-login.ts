import { type Controller, FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthentication } from '@/main/factories/domain/use-cases'

export const makeFacebookLoginController = (): Controller => {
  return new FacebookLoginController(makeFacebookAuthentication())
}
