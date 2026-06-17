import express from 'express'
import {connectDb} from '../src/lib/db/db_connection.js'
import { envConfig } from './lib/configs/env_config.js'
import AuthRouter from './routers/auth_route.js'
import CategoryRouter from './routers/category_route.js'
import cors from 'cors'

const app = express()

app.use(cors("*"))

app.use(express.json()) //parsing the request

connectDb().then(() => {
    app.listen(envConfig.PORT,() => {
        console.log(`Server successfully running on port ${envConfig.PORT}`);
    })

    app.use('/api/auth',AuthRouter)
    app.use('/api/auth',CategoryRouter)
}).catch((e)=>{
    console.log("err",e);
    
})

app.get('/',(req,res)=>{
    res.send("Hello world")
})

// nn45SNrDQGFL282Q

// ferozuddintalha_db_user