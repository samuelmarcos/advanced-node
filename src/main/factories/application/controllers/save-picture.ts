import { type Controller, SavePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '@/main/factories/domain/use-cases'
import { makePgTransactionController } from '@/main/factories/application/decorators'

export const makeSavePicureController = (): Controller => {
  const controller = new SavePictureController(makeChangeProfilePicture())
  return makePgTransactionController(controller)
}
