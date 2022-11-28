import { natsWrapper } from "./nats-wrapper";
import {OrderCreatedListener} from './events/listeners/order-created-listener';


const start = async () => {
  [
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
  } catch (err) {
    console.error(err);
  }
};

start();
