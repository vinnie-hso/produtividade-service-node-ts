import { Request, Response, response } from "express";

import { IFeature, ISimulacao } from "../ts";

// TODO: ProdutividadeService
import { ProdutividadeService } from "../services/ProdutividadeService";
import { IntegridadeService } from "../services/IntegridadeService";

export class ProdutividadeController {
    produtividadeService: ProdutividadeService;
    integridadeService: IntegridadeService

    constructor(
        produtividadeService = new ProdutividadeService(),
        integridadeService = new IntegridadeService()
    ) {
        this.produtividadeService = produtividadeService;
        this.integridadeService = integridadeService
    }

    private mountResponseData(responses: any[]): any {
        // console.log("Mount response data: ", responses)
        let responseData: any = {
            "produtividade": {}
        }

        responses.forEach((el) => {
            for (const [key, value] of Object.entries(el)) {
                responseData.produtividade[key] = value
            }
        })

        // * string
        // responseData = `"produtividade":` + JSON.stringify(responseData.produtividade)

        // * json
        return responseData
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
            feature: feature,
            integridade: {
                isValidGeometry: undefined,
                validationMessage: undefined
            }
        }

        const produtividade = await this.produtividadeService.calculate(simulacao)

        return response.status(200).send(produtividade)
    }

    public async calculateAll(request: Request, response: Response): Promise<Response> {
        try {
            const geojson = request.body

            const simulations = geojson.features.map((feat: IFeature) => {
                return {
                    id: feat.id,
                    cultura: geojson.properties.cultura,
                    municipio: geojson.properties.cod_municipio,
                    feature: feat,
                    integridade: {
                        isValidGeometry: true,
                        validationMessage: undefined
                    }
                }
            })

            // * INTEGRIDADE
            const validatedSimulations = await Promise.all(simulations.map(async (simulation: ISimulacao) => {
                return await this.integridadeService.validate(simulation)
            }))

            // * PRODUTIVIDADE
            const responses = await Promise.all(validatedSimulations.map(async (simulation: ISimulacao) => {

                if (simulation.integridade.isValidGeometry) return await this.produtividadeService.calculate(simulation)
                else return {
                    [simulation.id]: simulation.integridade.validationMessage
                }
            }))

            const responseData = this.mountResponseData(responses)
            return response.status(200).send(responseData)
        } catch (error) {
            return response.status(400).send(String(error))
        }
    }
}