import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;
const Types = mongoose.Types;
const ObjectId =Schema.ObjectId;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const userModel = model("Users",userSchema);

const contentTypes = ['image', 'video', 'article', 'audio']; // Extend as needed

const contentSchema = new Schema({
  link: { type: String} ,
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: 'Tag' }],
  userId: { type: Types.ObjectId, ref: 'User', required: true },
});

export const contentModel = model("Content",contentSchema);



