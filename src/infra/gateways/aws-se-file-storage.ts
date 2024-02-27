import { type UploadFile } from '@/domain/contracts/gateways'
import { config, S3 } from 'aws-sdk'

export class AwsS3FileSotrage implements UploadFile {
  constructor (accessKey: string, secret: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
      }
    })
  }

  public async upload ({ key, file }: UploadFile.Input): Promise<UploadFile.OutPut> {
    const s3 = new S3()

    await s3.putObject({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ACL: 'public-read'
    }).promise()

    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }
}
