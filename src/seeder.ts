import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import "colors";
import dotenv from "dotenv";
import { ROOT_DIR } from "./config/paths";

// load models
import Academy from "./models/Academy";
import Course from "./models/Course";
import User from "./models/User";
import Review from "./models/Review";
import type { IAcademy, ICourse, IReview, IUser, Seed } from "./types";

dotenv.config({ path: "./config/config.env" });

// connect to DB
void mongoose.connect(process.env.MONGO_URI ?? "");

/// Read JSON files
const readSeed = <T>(file: string): Seed<T>[] => {
  const raw: unknown = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, "_data", file), "utf-8"));
  return raw as Seed<T>[];
};

const academies = readSeed<IAcademy>("academies.json");
const courses = readSeed<ICourse>("courses.json");
const users = readSeed<IUser>("users.json");
const reviews = readSeed<IReview>("reviews.json");

// import into DB
const importData = async (): Promise<void> => {
  try {
    await Academy.create(academies);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// delete data
const deleteData = async (): Promise<void> => {
  try {
    await Academy.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  void importData();
} else if (process.argv[2] === "-d") {
  void deleteData();
}
