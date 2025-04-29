import mongoose from "mongoose";
import monitorWorker from "./monitorWorker.js";
import config from "../utils/config.js";


console.log('connecting worker to mongoDB')

await mongoose.connect(config.MONGODB_URL)
console.log('connected worker to mongoDB')
monitorWorker.run()
console.log('started monitor worker')