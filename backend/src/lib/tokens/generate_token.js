import jwt from 'jsonwebtoken'
import {envConfig} from '../configs/env_config.js'
export const accessToken = (payload) => {
    return jwt.sign(payload,envConfig.MART_SECRET,{expiresIn:'7d'})
}