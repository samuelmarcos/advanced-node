import { SavePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '../use-cases'

export const makeSavePicureController = (): SavePictureController => {
  return new SavePictureController(makeChangeProfilePicture())
}
