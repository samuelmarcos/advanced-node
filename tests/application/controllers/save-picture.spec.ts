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

  // it('should return 400 if file is not provided', async () => {
  //   const httpResponse = await sut.perform({ file: undefined as any, userId })

  //   expect(httpResponse).toEqual({
  //     statusCode: 400,
  //     data: new RequiredFieldError('file')
  //   })
  // })

  // it('should return 400 if file is empty', async () => {
  //   const httpResponse = await sut.perform({ file: { buffer: Buffer.from(''), mimeType }, userId })

  //   expect(httpResponse).toEqual({
  //     statusCode: 400,
  //     data: new RequiredFieldError('file')
  //   })
  // })

  // it('should return 400 if file type is invalid', async () => {
  //   const httpResponse = await sut.perform({ file: { buffer, mimeType: 'invalid_type' }, userId })

  //   expect(httpResponse).toEqual({
  //     statusCode: 400,
  //     data: new InvalidMimeTypeError(['png', 'jpeg'])
  //   })
  // })

  // it('should not return 400 if file type is valid', async () => {
  //   const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/png' }, userId })

  //   expect(httpResponse).not.toEqual({
  //     statusCode: 400,
  //     data: new InvalidMimeTypeError(['png', 'jpeg'])
  //   })
  // })

  // it('should not return 400 if file type is valid', async () => {
  //   const httpResponse = await sut.perform({ file: { buffer, mimeType: 'image/jpeg' }, userId })

  //   expect(httpResponse).not.toEqual({
  //     statusCode: 400,
  //     data: new InvalidMimeTypeError(['png', 'jpeg'])
  //   })
  // })

  // it('should not return 400 if file size is bigger than 5mb', async () => {
  //   const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024))
  //   const httpResponse = await sut.perform({ file: { buffer: invalidBuffer, mimeType }, userId })

  //   expect(httpResponse).toEqual({
  //     statusCode: 400,
  //     data: new MaxFileSizeError(5)
  //   })
  // })

  it('shoud build Validators correctly', async () => {
    const validators = sut.buildValidators({ file, userId })

    expect(validators).toEqual(
      [new Required(file, 'file'),
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
