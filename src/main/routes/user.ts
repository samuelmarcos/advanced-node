import { adaptExpressRoute as adapt, adaptMulter as upload } from '@/main/adapters'
import { makeSavePicureController } from '@/main/factories/controllers'
import { type Router } from 'express'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.delete('/users/picture', auth, adapt(makeSavePicureController()))
  router.put('/users/picture', auth, upload, adapt(makeSavePicureController()))
}
