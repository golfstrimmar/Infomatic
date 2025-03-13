import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yushinbox:oWzeXEp2gtCWhsS0@clusterinformatic.qz73m.mongodb.net/informatic?retryWrites=true&w=majority"
     
    );
    console.log("MongoDB clasterInformatic connected");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
