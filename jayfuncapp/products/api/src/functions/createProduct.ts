import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import Product from '../model/product';
import { CosmosClient } from '@azure/cosmos';
import { v4 as uuid } from 'uuid';

export async function createProduct(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  let product = request.body as unknown as Product;

  let productItem: Product = {
    id: uuid(),
    categoryName: product?.categoryName,
    sku: product?.sku,
    name: product?.name,
    description: product?.description,
    price: product?.price,
  };

  const connectionString = process.env.CosmosDbConnectionString;
  const databaseId = process.env.COSMOS_DATABASE_ID;
  const containerId = process.env.COSMOS_CONTAINER_ID;

  const client = new CosmosClient(connectionString);
  const database = client.database(databaseId);
  const container = database.container(containerId);

  const { resource } = await container.items.create(productItem);

  return {
    status: 201,
    body: `New product created, ${JSON.stringify(resource)}`,
  };
}

app.http('createProduct', {
  methods: ['POST'],
  route: 'product/create',
  authLevel: 'anonymous',
  handler: createProduct,
});
