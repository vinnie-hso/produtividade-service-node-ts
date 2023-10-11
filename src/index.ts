import express, { Express } from 'express';
import cors from "cors";
import dotenv from "dotenv";
// import "reflect-metadata";
import routes from "./routes";

dotenv.config()

const PORT = process.env.PORT || 5000
const app: Express = express()

// * use json
app.use(express.json());

// * set headers
app.use((request, response, next) => {
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
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

app.use(routes);