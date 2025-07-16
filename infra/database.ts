export const appTable = new sst.aws.Dynamo('AppTable', {
  transform: {
    table: {
      name: `${$app.name}-app-${$app.stage}`,
      deletionProtectionEnabled: $app.stage === 'prod'
    }
  },
  fields: {
    pk: 'string',
    sk: 'string',
    gsi1pk: 'string',
    gsi1sk: 'string',
    gsi2pk: 'string',
    gsi2sk: 'string',
  },
  primaryIndex: {
    hashKey: 'pk',
    rangeKey: 'sk'
  },
  globalIndexes: {
    GSI1: {
      hashKey: 'gsi1pk',
      rangeKey: 'gsi1sk',
      projection: 'all'
    },
    GSI2: {
      hashKey: 'gsi2pk',
      rangeKey: 'gsi2sk',
      projection: 'all'
    }
  }
}) 
