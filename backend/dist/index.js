"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const JWT_SECRET = "siddhant";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        yield db_1.userModel.create({
            username: username,
            password: password,
        });
        res.json({
            message: "user signup successfully",
        });
    }
    catch (error) {
        res.status(411).json({
            message: "user already exisits",
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = yield db_1.userModel.findOne({
            username,
            password,
        });
        if (existingUser) {
            const token = jsonwebtoken_1.default.sign({
                id: existingUser.id,
            }, JWT_SECRET);
            res.json({ token });
        }
        else {
            res.status(403).json({
                message: "incorrect credentials",
            });
        }
    }
    catch (error) {
        res.status(411).json({
            message: "please signup first",
        });
    }
}));
app.get("api/v1/content", (req, res) => { });
app.delete("api/v1/delete", (req, res) => { });
app.post("api/v1/brain/share", (req, res) => { });
app.get("/api/v1/brain/:shareLink", (req, res) => { });
app.listen(5000, () => {
    console.log("server is up");
});
