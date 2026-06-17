import mongoose from 'mongoose'
import {envConfig} from '../configs/env_config.js'
export const connectDb = async() => {
    try {
        const conn = await mongoose.connect(envConfig.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        process.exit(1); 
    }
}
 