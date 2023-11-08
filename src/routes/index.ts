import { Router, Request, Response } from "express";
import productivity from "./productivity";
import healthcheck from "./healthcheck"

const routes = Router();

routes.use("/produtividade", productivity);
routes.use("/healthcheck", healthcheck)

routes.use((req: Request, res: Response) =>
  res.status(404).json({ error: "Requisição desconhecida" })
);

export default routes;