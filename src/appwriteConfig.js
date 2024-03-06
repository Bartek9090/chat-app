import { Client, Databases, Account } from "appwrite";

// export const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
// export const DB_ID = import.meta.env.VITE_DB_ID;
// export const COLLECTION_ID_MESSAGES = import.meta.env
//   .VITE_COLLECTION_ID_MESSAGES;
export const PROJECT_ID = " 65e4ab8f4b678657ff73";
export const DB_ID = "65e6595c8482e575f11e";
export const COLLECTION_ID_MESSAGES = "65e6596caea47768ff4a";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")

  .setProject("65e4ab8f4b678657ff73");

export const databases = new Databases(client);
export const account = new Account(client);
export default client;
