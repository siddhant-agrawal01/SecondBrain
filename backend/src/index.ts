import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, userModel } from "./db";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utilis";

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

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  await ContentModel.create({
    link,
    type,
    //@ts-ignore
    userId: req.userId,
    tags: [],
  });
  res.json({
    message: "content created",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/delete", async (req, res) => {
  const contentId = req.body.contentId;
  await ContentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId: req.userId,
  });
  res.json({
    message: "deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;

  if (share) {
    const existingLink = await LinkModel.findOne({
      userId: req.userId,
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }
    const hash = random(10);
    await LinkModel.create({
      userId: req.userId,
      hash: hash,
    });
    res.json({
      message: hash,
    });
  } else {
    await LinkModel.deleteOne({
      userId: req.userId,
    });
    res.json({
      message: "removed  link",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;
  const link = await LinkModel.findOne({
    hash,
  });

  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
    return;
  }
  //userid

  const content = await ContentModel.findOne({
    userId: link.userId,
  });

  const user = await userModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    res.status(411).json({
      message: "user not found, error should ideally not happen",
    });
    return;
  }

  res.json({
    username: user.username,
    content: content,
  });
});

app.listen(5000, () => {
  console.log("server is up");
});
