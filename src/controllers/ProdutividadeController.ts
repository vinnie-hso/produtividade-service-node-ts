import { Request, Response } from "express";

import { IFeature, ISimulacao } from "../ts";

// TODO: ProdutividadeService
import { ProdutividadeService } from "../services/ProdutividadeService";


export class ProdutividadeController {
    produtividadeService: ProdutividadeService;

    constructor(produtividadeService = new ProdutividadeService()) {
        this.produtividadeService = produtividadeService;
    }

    public async calcular(request: Request, response: Response): Promise<Response> {

        const feature: IFeature = request.body

        if (!request.headers['simulacao.id'])
            return response.status(400).json({ message: 'Bad request: "simulacao.id" is required' })

        if (!request.headers['simulacao.cultura'])
            return response.status(400).json({ message: 'Bad request: "simulacao.cultura" is required' })

        if (!request.headers['simulacao.municipio'])
            return response.status(400).json({ message: 'Bad request: "simulacao.municipio" is required' })

        if (!feature)
            return response.status(400).json({ message: 'Bad request: "feature" is required' })

        const simulacao: ISimulacao = {
            id: request.headers['simulacao.id'],
            cultura: request.headers['simulacao.cultura'],
            municipio: request.headers['simulacao.municipio'],
            feature: feature
        }

        const produtividade = await this.produtividadeService.calculate(simulacao)

        return response.status(200).json(produtividade)
    }
}