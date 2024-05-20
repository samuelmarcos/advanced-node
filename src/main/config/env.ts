export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '280188701740394',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '9aacaf0a0cff805879c23dd0d3b91610'
  },
  jwtSecret: process.env.JWT_SECRET ?? 'ABACATE',
  appPort: process.env.PORT ?? '8080',
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY || '',
    secret: process.env.AWS_S3_SECRET || '',
    bucket: process.env.AWS_S3_BUCKET || ''
  }
}
