import { Router } from "express";

import { ProdutividadeController } from "../controllers";

const routes = Router();

const produtividadeController = new ProdutividadeController();

routes.post("/", produtividadeController.calcular.bind(produtividadeController)); 
routes.post("/all", produtividadeController.calculateAll.bind(produtividadeController)); 
routes.post("/all_refactor", produtividadeController.calculateAllRefactor.bind(produtividadeController)); 


export default routes;