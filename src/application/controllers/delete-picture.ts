import { type ChangeProfilePicture } from '@/domain/use-cases'
import { Controller } from './controller'
import { noContent, type HttpResponse } from '../helpers'

type HttpRequest = { userId: string }

export class DeletePictureController extends Controller {
  constructor (private readonly changeProfilePicture: ChangeProfilePicture) {
    super()
  }

  public async perform ({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id: userId })
    return noContent()
  }
}
