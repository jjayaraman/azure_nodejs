import { CosmosClient, SqlQuerySpec } from "@azure/cosmos";
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import Product from "../model/product";

export async function deleteProduct(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  let deleted: any;
  try {
    context.log(`Http function processed request for url "${request.url}"`);

    // For 1st CosmosDB connection
    // const connectionString = process.env.CosmosDbConnectionString;
    // const databaseId = process.env.COSMOS_DATABASE_ID;
    // const containerId = process.env.COSMOS_CONTAINER_ID;

    // For 2nd CosmosDB connection
    let connectionString = process.env.CosmosDbConnectionString2;
    let databaseId = "mydb";
    let containerId = "mycontainer";

    const client = new CosmosClient(connectionString);
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const id = request.query.get("id") || request.params.id;
    context.log(`id : ${id}`);

    const querySpec: SqlQuerySpec = {
      query: "SELECT * FROM c where c.id = @id",
      parameters: [{ name: "@id", value: id }],
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    const product = resources[0] as Product;
    context.log(`product id : ${product?.id}`);
    context.log(`product categoryId : ${product?.categoryId}`);
    if (product?.id) {
      // deleted = await container.item(product?.id, product?.categoryId).delete();
      deleted = await container.item(product?.id, product?.id).delete();
      const msg = `Product ${product?.id} deleted successfully`;
      context.info(msg);
      return {
        status: 200,
        body: msg,
        headers: {
          "content-type": "application/json",
        },
      };
    } else {
      const msg = `No product found for the given id ${product?.id} and not deleted`;
      context.info(msg);
      return {
        status: 204,
        body: msg,
        headers: {
          "content-type": "application/json",
        },
      };
    }
  } catch (error) {
    context.log(`Error: ${error}`);
    return {
      status: 400,
      body: "Failed to delete",
      headers: {
        "content-type": "application/json",
      },
    };
  }
}

app.http("deleteProduct", {
  methods: ["DELETE"],
  route: "product/delete/{id}",
  authLevel: "anonymous",
  handler: deleteProduct,
});
