import { Router } from "express";
import { userMiddleware } from "../middleware/usermiddleware";

export const userRouter = Router()

userRouter.use(userMiddleware)

userRouter.get('/project',async(req,res)=>{
    
})