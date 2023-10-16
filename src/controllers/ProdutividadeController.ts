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

        return response.status(200).send(produtividade)
    }

    public async calculateAll(request: Request, response: Response): Promise<Response> {
        console.time("total time")
        const geojson = request.body

        const simulations = geojson.features.map((feat: IFeature) => {
            return {
                id: feat.id,
                cultura: geojson.properties.cultura,
                municipio: geojson.properties.cod_municipio,
                feature: feat
            }
        })
        const responses = await Promise.all(simulations.map(async (simulation: ISimulacao) => {
            const result = await this.produtividadeService.calculate(simulation)
            return result
        }))

        let res: any = {
            "produtividade": {}
        }

        responses.forEach((el) => {
            for (const [key, value] of Object.entries(el)) {
                res.produtividade[key] = value
              }
        })

        res = "produtividade:" + JSON.stringify(res.produtividade)

        console.timeEnd("total time")

        return response.status(200).send(res)
    }
}