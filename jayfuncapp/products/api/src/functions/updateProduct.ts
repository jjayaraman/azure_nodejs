import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import Product from "../model/product";
import { CosmosClient } from "@azure/cosmos";
import { updateItem } from "../utils/cosmosDbUtils";

const connectionString = process.env.CosmosDbConnectionString;
const databaseId = process.env.COSMOS_DATABASE_ID;
const containerId = process.env.COSMOS_CONTAINER_ID;

export async function updateProduct(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    context.log(`Http function processed request for url "${request.url}"`);

    const product = (await request.json()) as Product;

    // const client = new CosmosClient(connectionString)
    // const db = client.database(databaseId)
    // const container = db.container(containerId)

    // const { resource } = await container.items.upsert(product)
    const { resource } = await updateItem(product);
    return {
      status: 201,
      body: `Product ${product?.id} updated successfully`,
      headers: {
        "content-type": "application/json",
      },
    };
  } catch (error) {
    context.error(`Error updating product item: ${error}`);
    return {
      status: 400,
      body: `Error updating product item: ${error}`,
      headers: {
        "content-type": "application/json",
      },
    };
  }
}

app.http("updateProduct", {
  methods: ["PUT"],
  route: "product/update",
  authLevel: "anonymous",
  handler: updateProduct,
});
