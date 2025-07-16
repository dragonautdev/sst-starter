export const customerFilesBucket = new sst.aws.Bucket('CustomerFiles', {
  transform: {
    bucket: {
      bucket: `${$app.name}-customer-files-${$app.stage}`,
    },
  },
  access: 'public',
  cors: {
    allowMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
    allowOrigins: ['*'],
    
  },
  policy: [{
    effect: 'allow',
    principals: '*',
    actions: ['s3:GetObject', 's3:GetObjectAcl'],
    paths: ['/*'],
  }, {
    effect: 'deny',
    principals: '*',
    actions: ['s3:*'],
    paths: ['/*'],
    conditions: [{
      variable: 'aws:SecureTransport',
      test: 'Bool',
      values: ['false'],
    }]
  }]
})
