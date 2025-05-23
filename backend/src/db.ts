import mongoose, { Schema, model } from "mongoose";

mongoose.connect(
  "mongodb+srv://sidanace:NUSd7e3aMa4K73Pb@cluster0.axooans.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0   "
);
const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
});

const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const userModel = model("User", UserSchema);
export const ContentModel = model("Content", ContentSchema);
