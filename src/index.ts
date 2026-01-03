import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { userModel } from "./db.js";
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import {z} from 'zod';
import cors from 'cors';
dotenv.config();

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


app.post("/api/v1/signin", (req,res)=>{

    
 
});
app.post("/api/v1/content", (req,res)=>{
 
});
app.get("/api/v1/content", (req,res)=>{
 
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
 
