import { Router } from "express";

import { ProdutividadeController } from "../controllers";

const routes = Router();

const produtividadeController = new ProdutividadeController();

routes.post("/", produtividadeController.calcular.bind(produtividadeController)); 


export default routes;