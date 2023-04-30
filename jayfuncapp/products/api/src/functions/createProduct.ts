import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions'
import Product from '../model/product'
import { CosmosClient } from '@azure/cosmos'
import { v4 as uuid } from 'uuid'
import { stringify } from 'flatted'

export async function createProduct(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.info(`Http function processed request for url "${request.url}"`)
  // context.debug(`request : ${JSON.stringify(request)}`)
  // context.debug(`context : ${JSON.stringify(context)}`)
  // context.debug(`body : ${JSON.stringify(request.json())}`)

  try {
    let product = request.json() as unknown as Product

    // context.log(`product : ${JSON.stringify(product)}`)

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

    const result = await container.items.create(productItem)

    context.debug(`resource : ${stringify(result)}`)
    return {
      status: 201,
      body: stringify(result),
      headers: {
        'content-type': 'application/json',
      },
    }
  } catch (error) {
    context.error(`Error creating product item: ${error}`)
    return {
      status: 400,
      body: `Error creating product item: ${error}`,
      headers: {
        'content-type': 'application/json',
      },
    }
  }
}

app.http('createProduct', {
  methods: ['POST'],
  route: 'product/create',
  authLevel: 'anonymous',
  handler: createProduct,
})
