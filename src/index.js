import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import categoriesRouter from "./routes/categoriesRouter.js";
import gamesRouter from "./routes/gamesRouter.js";
import customersRouter from "./routes/customersRouter.js";
import rentalsRouter from "./routes/rentalsRouter.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);
server.use(rentalsRouter);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("Server Online"));
