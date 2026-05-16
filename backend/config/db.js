import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://parag_audi:QNn0QNftHRl3oHcW@ac-wyjcjil-shard-00-00.dodzmhc.mongodb.net:27017,ac-wyjcjil-shard-00-01.dodzmhc.mongodb.net:27017,ac-wyjcjil-shard-00-02.dodzmhc.mongodb.net:27017/expense?ssl=true&authSource=admin&retryWrites=true&w=majority"
    );

    console.log("DB Connected");
  } catch (error) {
    console.log("DB Error:", error.message);
  }
};