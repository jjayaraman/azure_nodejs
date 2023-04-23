import { CosmosClient, SqlQuerySpec } from '@azure/cosmos';
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';

export async function getUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const connectionString = process.env.CosmosDbConnectionString;
  const databaseId = process.env.COSMOS_DATABASE_ID;
  const containerId = process.env.COSMOS_CONTAINER_ID;

  context.log(`databaseId: ${databaseId}, containerId: ${containerId}`);

  const client = new CosmosClient(connectionString);

  // Select the database and container
  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Perform a query to get all items from the container
  const querySpec: SqlQuerySpec = {
    query: 'SELECT TOP 10 * FROM c',
  };
  const { resources } = await container.items.query(querySpec).fetchAll();

  let response = {
    body: JSON.stringify(resources),
    headers: {
      'content-type': 'application/json',
    },
  };
  return response;
}

app.http('getUsers', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: getUsers,
});
