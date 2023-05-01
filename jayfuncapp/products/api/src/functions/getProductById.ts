import { CosmosClient, SqlQuerySpec } from '@azure/cosmos';
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { getById } from '../utils/cosmosDbUtils';

export async function getProductById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const id = request.query.get("id") || request.params.id;
  const pathId = request.params.id;
  context.log(`id: ${id}`);
  context.log(`pathId: ${pathId}`);

  // const connectionString = process.env.CosmosDbConnectionString;
  // const databaseId = process.env.COSMOS_DATABASE_ID;
  // const containerId = process.env.COSMOS_CONTAINER_ID;

  // const client = new CosmosClient(connectionString);
  // const db = client.database(databaseId);
  // const container = db.container(containerId);

  // const querySpec: SqlQuerySpec = {
  //   query: 'SELECT * FROM c where c.id = @id',
  //   parameters: [{ name: '@id', value: id }],
  // };
  // const { resources } = await container.items.query(querySpec).fetchAll();

  const { resources } = await getById(id);

  let response = {
    body: JSON.stringify(resources),
    headers: {
      "content-type": "application/json",
    },
  };
  return response;
}

app.http('getProductById', {
  methods: ['GET'],
  route: 'product/getbyid/{id}',
  authLevel: 'anonymous',
  handler: getProductById,
});
