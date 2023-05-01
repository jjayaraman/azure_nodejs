import { CosmosClient, SqlQuerySpec } from "@azure/cosmos";

const connectionString = process.env.CosmosDbConnectionString;
const databaseId = process.env.COSMOS_DATABASE_ID;
const containerId = process.env.COSMOS_CONTAINER_ID;

const client = new CosmosClient(connectionString);
const database = client.database(databaseId);
const container = database.container(containerId);

/**
 * Create a new item in CosmosDB
 * @param item
 * @returns
 */
export const createItem = async <T>(item: T): Promise<any> => {
  return await container.items.create<T>(item);
};

/**
 * Get an item in CosmosDB for the given input id
 * @param item
 * @returns
 */
export const getById = async (id: string): Promise<any> => {
  const querySpec: SqlQuerySpec = {
    query: "SELECT * FROM c where c.id = @id",
    parameters: [{ name: "@id", value: id }],
  };
  return await container.items.query(querySpec).fetchAll();
};
