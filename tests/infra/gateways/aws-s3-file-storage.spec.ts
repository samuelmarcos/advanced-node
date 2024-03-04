import { config, S3 } from 'aws-sdk'
import { mocked } from 'jest-mock'
import { AwsS3FileSotrage } from '@/infra/gateways'
jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let bukcket: string
  let key: string
  let sut: AwsS3FileSotrage

  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    bukcket = 'any_bucket'
    key = 'any key'
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

  describe('upload', () => {
    let file: Buffer
    let putObjectPromiseSpy: jest.Mock
    let putObjectSpy: jest.Mock

    beforeAll(() => {
      file = Buffer.from('any_buffer')
      putObjectPromiseSpy = jest.fn()
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })))
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

    it('should return encoded imageUrl', async () => {
      const imageUrl = await sut.upload({ key, file })

      expect(imageUrl).toBe(`https://${bukcket}.s3.amazonaws.com/any%20key`)
    })

    it('should rethrow if putObject throws', async () => {
      const error = new Error('upload errro')
      putObjectPromiseSpy.mockRejectedValueOnce(error)

      const promise = sut.upload({ key, file })

      await expect(promise).rejects.toThrow()
    })
  })

  describe('delete', () => {
    let deleteObjectPromiseSpy: jest.Mock
    let deleteObjectSpy: jest.Mock

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn()
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }))
      mocked(S3).mockImplementation(jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })))
    })

    it('should call deleteObject with correct values', async () => {
      await sut.delete({ key })

      expect(deleteObjectSpy).toHaveBeenCalledWith({
        Bucket: bukcket,
        Key: key
      })

      expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
    })

    it('should rethrow if deleteObject throws', async () => {
      const error = new Error('delete errro')
      deleteObjectPromiseSpy.mockRejectedValueOnce(error)

      const promise = sut.delete({ key })

      await expect(promise).rejects.toThrow()
    })
  })
})