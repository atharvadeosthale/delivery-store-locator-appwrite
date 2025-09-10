import { Client, TablesDB } from "node-appwrite";
import "server-only";

export const client = new Client();

client.setEndpoint(process.env.ENDPOINT!);
client.setProject(process.env.PROJECT_ID!);
client.setKey(process.env.API_KEY!);

export const tablesdb = new TablesDB(client);
