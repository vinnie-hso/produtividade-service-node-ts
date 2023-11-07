import "express-async-errors"; 
import express, { Express } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";
import routes from "./routes";
import { errorHandler } from './middlewares';

dotenv.config()

const PORT = process.env.PORT || 5000
const app: Express = express()

// * use json
app.use(express.json());

// * set headers
app.use((request, response, next) => {
  response.setHeader("Content-Type", "application/json")
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
})

// * use cors
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
})
);

// * routes
app.use(routes);

// * error handling
app.use(errorHandler)

// * app listen
app.listen(PORT, () => console.log(`Serviço PreSeg - Produtividade rodando na porta ${PORT}`));
