import mongoose from "mongoose";
import { bold } from "colors";

const connectDB = async (): Promise<void> => {
  const conn = await mongoose.connect(process.env.MONGO_URI ?? "");

  console.log(
    // bold() as a call: `.bold` on strings is typed as the legacy String.prototype.bold method
    bold(`MongoeDB Connected: ${conn.connection.host}`.cyan.underline),
  );
};

export default connectDB;
