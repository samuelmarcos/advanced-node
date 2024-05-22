import { type ChangeProfilePicture } from '@/domain/use-cases'
import { ok, type HttpResponse } from '@/application/helpers/http'
import { type Validator, ValidationBuilder as Builder } from '@/application/validation'

import { Controller } from './controller'

type HttpRequest = { file: { buffer: Buffer, mimeType: string }, userId: string }
type Model = Error | { pictureUrl?: string, initials?: string }

export class SavePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  override async perform ({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const data = await this.changeProfilePicture({ id: userId, file })
    return ok(data)
  }

  override buildValidators ({ file }: HttpRequest): Validator[] {
    if (file === undefined) return []
    return [
      ...Builder.of({ value: file, fieldName: 'file' })
        .required()
        .image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 })
        .build()
    ]
  }
}
