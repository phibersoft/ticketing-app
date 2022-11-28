import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const start = async () => {
  [
    "JWT_KEY",
    "MONGO_URI",
    "NATS_CLIENT_ID",
    "NATS_URL",
    "NATS_CLUSTER_ID",
  ].forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  });

  try {
    // NATS Setup
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    // MongoDB Setup
    await mongoose.connect(process.env.MONGO_URI!);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Tickets Service listening on port 3000.");
  });
};

start();
