import { Router } from "express";
import { SigninSchema, SignupSchema } from "../types";
import { compare, hash } from "bcrypt";
import client from '../lib/prisma'
import jwt from 'jsonwebtoken'

export const router = Router()

router.post('/signup',async (req,res )=>{
    const parseData = SignupSchema.safeParse(req.body)

    if(!parseData.success){
        res.status(400).json({message:'validation failed'})
        return
    }

    const hashedPassword = await hash(parseData.data.password, 10)

    try {
        const user  =  await client.user.create({
            data: {
                username:parseData.data.username,
                password:hashedPassword,
                firstName:parseData.data.firstname,
                lastName:parseData.data.lastname,
                role:'User'
            }
        })
        if (!process.env.JWT_PASSWORD) {
            throw new Error('Missing JWT_SECRET in environment variables');
        }
        const token = jwt.sign({userId: user.id,role:user.role},process.env.JWT_PASSWORD)


        res.json({token})
    }
    catch(err){
        res.status(400).json({message:'User already exist'})
    }
})

router.post('/signin',async(req,res)=>{

    const parseData = SigninSchema.safeParse(req.body)

    if(!parseData.success){
        res.status(403).json({message:'validation failed'})
        return
    }

    try {
        const user = await client.user.findUnique({
            where:{
                username:parseData.data.username
            }
        })
        if(!user){
            res.status(403).json({message:'User not found'})
            return
        }
        const isValid = await compare(parseData.data.password,user.password)

        if(!isValid){
            res.status(403).json({message:'Invalid password'})
            return
        }
        if (!process.env.JWT_PASSWORD) {
            throw new Error('Missing JWT_SECRET in environment variables');
        }       
        const token = jwt.sign({userId:user.id,role:user.role},process.env.JWT_PASSWORD)
        
        res.status(200).json({token})
    }
    catch(e){
        res.status(400).json({message:'Internal server error'})
    }
})