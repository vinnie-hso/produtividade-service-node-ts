import { Router } from "express";
import { ProductivityController } from "../controllers";

const routes = Router();

const productivityController = new ProductivityController();

routes.post("/", productivityController.calculate.bind(productivityController));
routes.post("/all", productivityController.calculateAll.bind(productivityController));


export default routes;