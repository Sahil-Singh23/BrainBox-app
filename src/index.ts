import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { contentModel, userModel } from "./db.js";
import bcrypt from 'bcrypt';
import {z} from 'zod';
import cors from 'cors';
import authMiddleware from "./middleware.js";
import * as dotenv from 'dotenv';
dotenv.config();
const jwt_secret = process.env.jwt_secret;

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  throw new Error("DB_URL environment variable is not set");
}

mongoose.connect(dbUrl);

const app = express();
app.use(express.json());  
app.use(cors());

const signSchema = z.object({
    username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(128, { message: "Password must be at most 128 characters long" }),
});

app.post("/api/v1/signup", async(req,res)=>{  

    const parsed = signSchema.safeParse(req.body);
    if(!parsed.success){
        res.status(400).json({
            message: "Validation error",
            errors: parsed.error.issues,
        });
        return;
    }

    const username = parsed.data.username;
    const password = parsed.data.password;

    try{
        const hashedPass = await bcrypt.hash(password,5);
        const r = await userModel.create({
            username: username,
            password: hashedPass,
        })
        res.status(200 ).json({
        message: "User signed up "
        })

    }catch (e) {
    res.status(411).json({ message: "User already exists" });
    return;
  }
});


app.post("/api/v1/signin", async(req,res)=>{
    const parsed = signSchema.safeParse(req.body);
    if(!parsed.success){
        return res.status(400).json({
            message: "Validation error",
            errors: parsed.error.issues,
        });
    }

    const username = parsed.data.username;
    const password = parsed.data.password;

    const exsistingUser = await userModel.findOne({username});

    if(!exsistingUser){
        return res.status(401).json({message:"Invalid username"})
    }

    const passwordMatch = await bcrypt.compare(password,exsistingUser.password);
    if(!passwordMatch){
        return res.status(401).json({message:"Invalid password"})
    }else{
        const token = jwt.sign({id:exsistingUser._id },jwt_secret!)
        res.json({message:"SignIn successful",token})
    }
});


app.post("/api/v1/content",authMiddleware, async(req,res)=>{
    const link: string= req.body.link;
    const type: string = req.body.type;

    if (!req.userId) {
        return res.status(401).json({ message: "User ID not found" });
    }
    await contentModel.create({
        link,
        type,
        userId:req.userId,
        tags:[],
    })

    return res.json({message:"Created a new content entry "}) 
});
app.get("/api/v1/content", authMiddleware, async(req,res)=>{
    if (!req.userId) {
        return res.status(401).json({ message: "User ID not found" });
    }
    const data = await contentModel.find({userId:req.userId})

    
});
app.delete("/api/v1/content", (req,res)=>{
 
});
app.post("/api/v1/brain/share", (req,res)=>{
 
});
app.get("/api/v1/brain/share", (req,res)=>{
 
});

app.listen(2000, () => {
  console.log("Server running on port 2000");
});
 
