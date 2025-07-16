
import { user } from "./user";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { Service } from "electrodb";

// Create the base DynamoDB client
const dynamoDbClient = new DynamoDBClient();

// Create a document client with option to remove undefined values
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  }
});

const tableName = Resource.AppTable.name

export const AppService = new Service({
  user,
}, {
  client: documentClient,
  table: tableName
})
