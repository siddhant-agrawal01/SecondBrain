import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { userModel } from "./db";
import {JWT_SECRET} from './config'

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    await userModel.create({
      username: username,
      password: password,
    });
    res.json({
      message: "user signup successfully",
    });
  } catch (error) {
    res.status(411).json({
      message: "user already exisits",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const existingUser = await userModel.findOne({
      username,
      password,
    });

    if (existingUser) {
      const token = jwt.sign(
        {
          id: existingUser.id,
        },
        JWT_SECRET
      );
      res.json({ token });
    } else {
      res.status(403).json({
        message: "incorrect credentials",
      });
    }
  } catch (error) {
    res.status(411).json({
      message: "please signup first",
    });
  }
});

app.get("/api/v1/content", (req, res) => {});

app.delete("/api/v1/delete", (req, res) => {});

app.post("/api/v1/brain/share", (req, res) => {});

app.get("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(5000, () => {
  console.log("server is up");
});
