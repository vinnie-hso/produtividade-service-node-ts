import { Request, Response } from "express";
import { IFeature, ISimulacao } from "../ts";
import { ProductivityService } from "../services/ProductivityService";
import { IntegrityService } from "../services/IntegrityService";

export class ProductivityController {
    productivityService: ProductivityService;
    integrityService: IntegrityService

    constructor(
        productivityService = new ProductivityService(),
        integrityService = new IntegrityService()
    ) {
        this.productivityService = productivityService;
        this.integrityService = integrityService
    }

    private mountResponseData(responses: any[]): any {
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

    public async calculate(request: Request, response: Response): Promise<Response> {

        const feature: IFeature = request.body

        if (!request.headers['simulacao.id'])
            return response.status(400).json({ message: 'Bad request: "simulacao.id" is required' })

        if (!request.headers['simulacao.cultura'])
            return response.status(400).json({ message: 'Bad request: "simulacao.cultura" is required' })

        if (!request.headers['simulacao.municipio'])
            return response.status(400).json({ message: 'Bad request: "simulacao.municipio" is required' })

        if (!feature)
            return response.status(400).json({ message: 'Bad request: "feature" is required' })

        const simulation: ISimulacao = {
            id: request.headers['simulacao.id'],
            cultura: request.headers['simulacao.cultura'],
            municipio: request.headers['simulacao.municipio'],
            feature: feature,
            integridade: {
                isValidGeometry: undefined,
                validationMessage: undefined
            }
        }

        const productivity = await this.productivityService.calculate(simulation)

        return response.status(200).send(productivity)
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
                return await this.integrityService.validate(simulation)
            }))

            // * PRODUTIVIDADE
            const responses = await Promise.all(validatedSimulations.map(async (simulation: ISimulacao) => {

                if (simulation.integridade.isValidGeometry) return await this.productivityService.calculate(simulation)
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