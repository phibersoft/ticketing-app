import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  ["JWT_KEY", "MONGO_URI"].forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`${key} is not defined`);
    }
  });

  try {
    await mongoose.connect(process.env.MONGO_URI!);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Auth Service listening on port 3000.");
  });
};

start();
