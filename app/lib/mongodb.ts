import { MongoClient } from 'mongodb';

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    throw new Error('A variável DATABASE_URL não está configurada.');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }

    return globalWithMongo._mongoClientPromise;
  }

  client = new MongoClient(uri, options);
  clientPromise = client.connect();

  return clientPromise;
}
