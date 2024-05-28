import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeSavePicureController } from '@/main/factories/controllers'
import { type Router } from 'express'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeSavePicureController()))
}
