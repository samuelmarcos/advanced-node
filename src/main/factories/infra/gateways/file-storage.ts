import { AwsS3FileSotrage } from '@/infra/gateways'
import { env } from '@/main/config/env'

export const makeAwsS3FileStorage = (): AwsS3FileSotrage => {
  return new AwsS3FileSotrage(env.s3.accessKey, env.s3.secret, env.s3.bucket)
}
