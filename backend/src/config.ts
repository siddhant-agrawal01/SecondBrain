import dotenv from "dotenv";
dotenv.config();

export const JWT_PASSWORD = process.env.JWT_SECRET || "fallback_secret_not_for_production";