import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { userModel } from "./db.js";
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import {z} from 'zod';
dotenv.config();

const app = express();
app.use(express.json());  

app.post("api/v1/signup", async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    await userModel.create({
        username: username,
        password: password,
    })

    res.json({
        message: "User signed up "
    })
});
app.post("api/v1/signin", (req,res)=>{
 
});
app.post("api/v1/content", (req,res)=>{
 
});
app.get("api/v1/content", (req,res)=>{
 
});
app.delete("api/v1/content", (req,res)=>{
 
});
app.post("api/v1/brain/share", (req,res)=>{
 
});
app.get("api/v1/brain/share", (req,res)=>{
 
});

app.listen(2000);
