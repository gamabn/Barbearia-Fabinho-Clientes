import { MongoClient} from "mongodb";

const url = process.env.DATABASE_URL || "mongodb://localhost:27017";

if (!url) {
  throw new Error("DATABASE_URL não definida");
}

const client = new MongoClient(url);

let clientPromise = client.connect();

export default clientPromise;