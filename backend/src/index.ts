import { PrismaClient } from '@prisma/client'
import express from 'express'
const client = new PrismaClient()
const app = express()
app.use(express.json())
app.get('')

app.listen(3000,async()=>{
    try{

        await client.$connect()
        console.log('prisma connected')
    }catch{
        console.log('error')
    }
})