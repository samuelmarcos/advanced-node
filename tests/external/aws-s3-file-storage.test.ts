// import { AwsS3FileSotrage } from '@/infra/gateways/aws-s3-file-storage'
// import { env } from '@/main/config/env'

// import axios from 'axios'

// describe('AWS S3 Integration Test', () => {
//   let sut: AwsS3FileSotrage

//   beforeEach(() => {
//     sut = new AwsS3FileSotrage(env.s3.accessKey, env.s3.secret, env.s3.bucket)
//   })

//   it('should upload and delete an image to aws s3', async () => {
//     const pixelImage = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+L+U4T8ABu8CpCYJ1DQAAAAASUVORK5CYII='
//     const file = Buffer.from(pixelImage, 'base64')
//     const fileName = 'any_file_name.png'

//     const [pictureUrl] = await sut.upload({ fileName, file })

//     await sut.delete({ fileName })

//     await expect(axios.get(pictureUrl)).rejects.toThrow()
//   })
// })
