import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions'
import Product from '../model/product'
import { CosmosClient } from '@azure/cosmos'
import { v4 as uuid } from 'uuid'

export const createProduct = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  context.log(`Http function processed request for url "${request.url}"`)
  context.log(`request : ${JSON.stringify(request)}`)
  context.log(`context : ${JSON.stringify(context)}`)
  context.log(`body : ${JSON.stringify(request.body)}`)

  try {
    let product = request.body as unknown as Product

    context.log(`product : ${JSON.stringify(product)}`)

    let productItem: Product = {
      id: uuid(),
      categoryId: uuid(),
      categoryName: product?.categoryName,
      sku: product?.sku,
      name: product?.name,
      description: product?.description,
      price: product?.price,
    }

    // context.log(`productItem : ${JSON.stringify(productItem)}`);

    const connectionString = process.env.CosmosDbConnectionString
    const databaseId = process.env.COSMOS_DATABASE_ID
    const containerId = process.env.COSMOS_CONTAINER_ID

    const client = new CosmosClient(connectionString)
    const database = client.database(databaseId)
    const container = database.container(containerId)

    const resource = await container.items.create(productItem)

    //   context.log(`resource : ${JSON.stringify(resource)}`);
    return {
      status: 201,
      body: JSON.stringify('xxx'),
      headers: {
        'content-type': 'application/json',
      },
    }
  } catch (error) {
    context.log(`Error creating product item: ${error}`)
  }
}

app.http('createProduct', {
  methods: ['POST'],
  route: 'product/create',
  authLevel: 'anonymous',
  handler: createProduct,
})
