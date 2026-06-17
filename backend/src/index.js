import express from 'express'
import {connectDb} from '../src/lib/db/db_connection.js'
import { envConfig } from './lib/configs/env_config.js'
import AuthRouter from './routers/auth_route.js'
import CategoryRouter from './routers/category_route.js'
import cors from 'cors'

const app = express()

app.use(cors({origin:"*"}))

app.use(express.json()) //parsing the request

app.get('/',(req,res)=>{
    res.send("Hello world")
})
app.use('/api/auth',AuthRouter)
app.use('/api',CategoryRouter)

connectDb().then(() => {
    app.listen(envConfig.PORT,() => {
        console.log(`Server successfully running on port ${envConfig.PORT}`);
    })

}).catch((e)=>{
    console.log("err",e);
    process.exit(1)
})

