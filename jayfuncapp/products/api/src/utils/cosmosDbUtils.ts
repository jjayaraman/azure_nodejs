import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.CosmosDbConnectionString;
const databaseId = process.env.COSMOS_DATABASE_ID;
const containerId = process.env.COSMOS_CONTAINER_ID;

const client = new CosmosClient(connectionString);
const database = client.database(databaseId);
const container = database.container(containerId);

export const create = async <T>(item: T): Promise<any> => {
  return await container.items.create<T>(item);
};
