import {v2 as cloudinary} from 'cloudinary'
import {envConfig} from '../configs/env_config.js'
// Configuration
    cloudinary.config({ 
        cloud_name: envConfig.CLOUDINARY_CLOUD_NAME, 
        api_key: envConfig.CLOUDINARY_API_KEY, 
        api_secret: envConfig.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

export default cloudinary