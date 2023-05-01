import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import Product from "../model/product";
import { v4 as uuid } from "uuid";
import { createItem } from "../utils/cosmosDbUtils";

export async function createProduct(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.info(`Http function processed request for url "${request.url}"`);
  try {
    let body = await request.json();
    const product = body as Product;
    context.log(`product : ${JSON.stringify(body)}`);

    let productItem = {
      id: uuid(),
      categoryId: uuid(),
      categoryName: product?.categoryName,
      sku: product?.sku,
      name: product?.name,
      description: product?.description,
      price: product?.price,
    };

    context.log(`productItem : ${JSON.stringify(productItem)}`);

    const { resource } = await createItem<Product>(productItem);

    return {
      status: 201,
      body: `Product ${productItem.id} inserted successfully`,
      headers: {
        "content-type": "application/json",
      },
    };
  } catch (error) {
    context.error(`Error creating product item: ${error}`);
    return {
      status: 400,
      body: `Error creating product item: ${error}`,
      headers: {
        "content-type": "application/json",
      },
    };
  }
}

app.http("createProduct", {
  methods: ["POST"],
  route: "product/create",
  authLevel: "anonymous",
  handler: createProduct,
});
