import { config } from 'aws-sdk'

jest.mock('aws-sdk')

class AwsS3FileSotrage {
  constructor (private readonly accessKey: string, private readonly secret: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }
}

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let sut: AwsS3FileSotrage

  beforeEach(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    sut = new AwsS3FileSotrage(accessKey, secret)
  })

  it('should config aws credentials on creation', async () => {
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })

    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
