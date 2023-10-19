import express, { Express } from 'express';
import cors from "cors";
import dotenv from "dotenv";
// import "reflect-metadata";
import routes from "./routes";

import { HealthcheckUtils } from "./utils";

const cron = require("node-cron");

dotenv.config()

const PORT = process.env.PORT || 5000
const app: Express = express()

// * use json
app.use(express.json());

// * healthcheck cron-job
cron.schedule("* * * * *", async () => {
  const healthcheckJob = new HealthcheckUtils()
  const isHealthy = await healthcheckJob.checkService()
  if (isHealthy)
    console.log(`Healthcheck Status: ${isHealthy.status} - Data: ${JSON.stringify(isHealthy.data)}`)
});


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

// * app listen
app.listen(PORT, () => console.log(`Serviço PreSeg - Produtividade rodando na porta ${PORT}`));

app.use(routes);