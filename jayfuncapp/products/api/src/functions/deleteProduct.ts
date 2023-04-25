import { CosmosClient, SqlQuerySpec } from '@azure/cosmos';
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import Product from '../model/product';

export async function deleteProduct(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  let deleted: any;
  try {
    context.log(`Http function processed request for url "${request.url}"`);

    const connectionString = process.env.CosmosDbConnectionString;
    const databaseId = process.env.COSMOS_DATABASE_ID;
    const containerId = process.env.COSMOS_CONTAINER_ID;

    const client = new CosmosClient(connectionString);
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const id = request.query.get('id') || request.params.id;
    context.log(`id : ${id}`);

    const querySpec: SqlQuerySpec = {
      query: 'SELECT * FROM c where c.id = @id',
      parameters: [{ name: '@id', value: id }],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    const product = resources[0] as Product;
    context.log(`product id : ${product?.id}`);
    context.log(`product categoryId : ${product?.categoryId}`);
    deleted = await container.item(product?.id, product?.categoryId).delete();

    context.log(`deleted : ${deleted}`);
  } catch (error) {
    context.log(`Error: ${error}`);
    return {
      status: 400,
      body: 'Failed to delete',
      headers: {
        'content-type': 'application/json',
      },
    };
  }
  return {
    status: 200,
    body: 'Deleted successfully',
    headers: {
      'content-type': 'application/json',
    },
  };
}

app.http('deleteProduct', {
  methods: ['DELETE'],
  route: 'product/delete/{id}',
  authLevel: 'anonymous',
  handler: deleteProduct,
});
