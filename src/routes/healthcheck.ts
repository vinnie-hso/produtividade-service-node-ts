import { Router } from "express";
import { HealthcheckController } from "../controllers";

const routes = Router();

const healthcheckController = new HealthcheckController();

routes.get("/", healthcheckController.check.bind(healthcheckController));

export default routes;