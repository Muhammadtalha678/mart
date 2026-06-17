import 'dotenv/config'

export const envConfig = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    MART_SECRET: process.env.MART_SECRET
}