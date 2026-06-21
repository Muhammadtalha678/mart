import express from 'express'
import {connectDb} from '../src/lib/db/db_connection.js'
import { envConfig } from './lib/configs/env_config.js'
import AuthRouter from './routers/auth_route.js'
import CategoryRouter from './routers/category_route.js'
import ProductRouter from './routers/product_route.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors({origin:"*",credentials:true}))

app.use(cookieParser()) // 3. LAZMI MIDDLEWARE: Iske bina req.cookies khali milega
app.use(express.json()) //parsing the request

app.get('/',(req,res)=>{
    res.send("Hello world")
})
app.use('/api/auth',AuthRouter)
app.use('/api',CategoryRouter)
app.use('/api',ProductRouter)

connectDb().then(() => {
    app.listen(envConfig.PORT,() => {
        console.log(`Server successfully running on port ${envConfig.PORT}`);
    })

}).catch((e)=>{
    console.log("err",e);
    process.exit(1)
})

