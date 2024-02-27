import { config, S3 } from 'aws-sdk'
import { mocked } from 'jest-mock'
import { AwsS3FileSotrage } from '@/infra/gateways'
jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let bukcket: string
  let file: Buffer
  let key: string
  let sut: AwsS3FileSotrage
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bukcket = 'any_bucket'
    file = Buffer.from('any_buffer')
    key = 'any_key'
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
    mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
  })

  beforeEach(() => {
    sut = new AwsS3FileSotrage(accessKey, secret, bukcket)
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

  it('should call putObject with correct values', async () => {
    await sut.upload({ key, file })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket: bukcket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    })

    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })

  it('should return imageUrl', async () => {
    const imageUrl = await sut.upload({ key, file })

    expect(imageUrl).toBe(`https://${bukcket}.s3.amazonaws.com/${key}`)
  })

  it('should return encoded imageUrl', async () => {
    const imageUrl = await sut.upload({ key: 'any key', file })

    expect(imageUrl).toBe(`https://${bukcket}.s3.amazonaws.com/any%20key`)
  })

  it('should rethrow if putObject throws', async () => {
    const error = new Error('upload errro')
    putObjectPromiseSpy.mockRejectedValueOnce(error)

    const promise = sut.upload({ key: 'any key', file })

    await expect(promise).rejects.toThrow()
  })
})
