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
  it('should config aws credentials on creation', async () => {
    const accessKey = 'any_access_key'
    const secret = 'any_secret'

    const sut = new AwsS3FileSotrage(accessKey, secret)

    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })

    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
