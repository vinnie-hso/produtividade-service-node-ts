import express, { Express } from 'express';
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";
import routes from "./routes";
import dataSource from './database';

dotenv.config()

const PORT = process.env.PORT || 5000
const app: Express = express()

// * initialize datasource
dataSource
  .initialize()
  .then(() => {
    console.log("Data Source inicializado");
  })
  .catch((e) => {
    console.error("Erro na inicialização do Data Source:", e);
  });

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

app.use(routes);

// * app listen
app.listen(PORT, () => console.log(`Serviço PreSeg - Produtividade rodando na porta ${PORT}`));
