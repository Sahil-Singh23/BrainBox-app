import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;
const ObjectId =Schema.ObjectId;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


export const userModel = model("Users",userSchema);
