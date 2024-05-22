import { DeletePictureController } from '@/application/controllers'
import { makeChangeProfilePicture } from '../use-cases'

export const makeDeletePicureController = (): DeletePictureController => {
  return new DeletePictureController(makeChangeProfilePicture())
}
