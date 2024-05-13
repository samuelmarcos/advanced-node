import { Controller, SavePictureController } from '@/application/controllers'
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation'

describe('SavePictureController', () => {
  let buffer: Buffer
  let mimeType: string
  let userId: string
  let file: {
    buffer: Buffer
    mimeType: string
  }
  let sut: SavePictureController
  let changeProfilePicture: jest.Mock

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    userId = 'any_user_id'
    mimeType = 'image/png'
    file = {
      buffer,
      mimeType
    }
    changeProfilePicture = jest.fn().mockResolvedValue({ pictureUrl: 'any_url', initials: 'any_initials' })
  })

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture)
  })

  it('should extend controller', async () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('shoud build Validators correctly', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer)
    ])
  })

  it('should call ChangeProfilePicture with correct input', async () => {
    await sut.perform({ file, userId })

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file: file.buffer })
    expect(changeProfilePicture).toHaveBeenCalledTimes(1)
  })

  it('should return 200 with valid data', async () => {
    const httpResponse = await sut.perform({ file, userId })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { pictureUrl: 'any_url', initials: 'any_initials' }
    })
  })
})
