import { Request, Response } from "express";
import { RendimentoMuncipioService } from "../services/RendimentoMunicipioService";

export class HealthcheckController {
    constructor() { }

    public async check(request: Request, response: Response) {
        try {
            return response.status(200).json({ message: "Serviço PreSeg - Produtividade está saudável" })
        } catch (error: any) {
            return response.status(500).json({ message: `Serviço PreSeg - Produtividade error: ${error.message}` })
        }
    }
}