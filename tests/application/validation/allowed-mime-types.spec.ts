import { InvalidMimeTypeError } from '@/application/errors'

type Entension = 'png' | 'jpg'

class AllowedMimeTypes {
  constructor (private readonly allowed: Entension[],
    private readonly mimetype: string) {}

  validate (): Error {
    return new InvalidMimeTypeError(this.allowed)
  }
}

describe('AllowedMimeTypes', () => {
  it('should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg')

    const error = sut.validate()

    expect(error).toEqual(new InvalidMimeTypeError(['png']))
  })
})
