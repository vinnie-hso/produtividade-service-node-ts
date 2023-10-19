import { Request, Response } from "express";
import { RendimentoMuncipioService } from "../services/RendimentoMunicipioService";

export class HealthcheckController {
    rendimentoMunicipioService: RendimentoMuncipioService

    constructor(rendimentoMunicipioService = new RendimentoMuncipioService) {
        this.rendimentoMunicipioService = rendimentoMunicipioService
    }

    public async check(request: Request, response: Response) {
        try {
            const municipio = 4103602
            const cultura = "soja"
            await this.rendimentoMunicipioService.getRendimento5AnosByMunicipio(municipio, cultura)
            
            return response.status(200).json({ message: "Serviço PreSeg - Produtividade está saudável"})
        } catch (error: any) {
            return response.status(500).json({ message: `Serviço PreSeg - Produtividade error: ${error.message}`})
        }
    }
}