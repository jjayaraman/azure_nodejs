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

  context.log(`product : ${JSON.stringify(product)}`);

  let productItem: Product = {
    id: uuid(),
    categoryName: product?.categoryName,
    sku: product?.sku,
    name: product?.name,
    description: product?.description,
    price: product?.price,
  };

  context.log(`productItem : ${JSON.stringify(productItem)}`);

  const connectionString = process.env.CosmosDbConnectionString;
  const databaseId = process.env.COSMOS_DATABASE_ID;
  const containerId = process.env.COSMOS_CONTAINER_ID;

  const client = new CosmosClient(connectionString);
  const database = client.database(databaseId);
  const container = database.container(containerId);

  const resource = await container.items.create(productItem);

  context.log(`resource : ${JSON.stringify(resource)}`);
  return {
    status: 201,
    body: JSON.stringify(resource),
    headers: {
      'content-type': 'application/json',
    },
  };
}

app.http('createProduct', {
  methods: ['POST'],
  route: 'product/create',
  authLevel: 'anonymous',
  handler: createProduct,
});
