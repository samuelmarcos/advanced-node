import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeDeletePicureController } from '@/main/factories/controllers'
import { type Router } from 'express'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeDeletePicureController()))
}
