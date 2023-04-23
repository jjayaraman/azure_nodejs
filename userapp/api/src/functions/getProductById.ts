import { CosmosClient, SqlQuerySpec } from '@azure/cosmos';
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';

export async function getProductById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const id = request.query.get('id');
  context.log(`id: ${id}`);
  const connectionString = process.env.CosmosDbConnectionString;
  const databaseId = process.env.COSMOS_DATABASE_ID;
  const containerId = process.env.COSMOS_CONTAINER_ID;

  const client = new CosmosClient(connectionString);
  const db = client.database(databaseId);
  const container = db.container(containerId);

  const querySpec: SqlQuerySpec = {
    query: 'SELECT * FROM c where c.id = @id',
    parameters: [{ name: '@id', value: id }],
  };
  const result = await container.items.query(querySpec).fetchAll();
  return { body: JSON.stringify(result) };
}

app.http('getProductById', {
  methods: ['GET', 'POST'],
  authLevel: 'anonymous',
  handler: getProductById,
});
