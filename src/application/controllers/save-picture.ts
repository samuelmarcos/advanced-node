import { type ChangeProfilePicture } from '@/domain/use-cases'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'
import { badRequest, ok, type HttpResponse } from '@/application/helpers/http'
import { InvalidMimeTypeError, MaxFileSizeError, RequiredFieldError } from '@/application/errors'
import { ValidationComposite, type Validator } from '@/application/validation'
import { Controller } from './controller'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { pictureUrl?: string, initials?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  override async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const data = await this.changeProfilePicture({ id: userId, file: file.buffer })
    return ok(data)
  }

  override buildValidators ({ file, userId }: any): Validator[] {
    return [
      new Required(file, 'file'),
      new RequiredBuffer(file.buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], file.mimeType),
      new MaxFileSize(5, file.buffer)
    ]
  }
}
