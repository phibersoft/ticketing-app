import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { sign } from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY = 'sk_test_51M8qEyF54dfzrIqE2a3q9zo9RYSRNRCqR2rduO6rQPZn23O6vgclGYMwxVTlZrtFwO4v1naRkjoVZd5zrBzhwWiJ00wmMUQG8j'
let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB");
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
