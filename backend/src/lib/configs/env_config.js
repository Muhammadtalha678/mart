import 'dotenv/config'

export const envConfig = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    MART_SECRET: process.env.MART_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}