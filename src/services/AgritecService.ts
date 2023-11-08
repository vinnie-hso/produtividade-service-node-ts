const axios = require('axios')
import { IAgritecPayload, IAgritecConfig } from "../ts";

export class AgritecService {

    config: IAgritecConfig

    constructor(
        config: IAgritecConfig = {
            headers: {
                Authorization: `Bearer ${process.env.AGRITEC_API_KEY}`,
            },
            params: {}
        }
    ) {
        this.config = config
    }

    private getCultureCode(culture: any) {
        if (culture === "soja") return 60
        if (culture === "milho_1" || culture === "milho_2") return 56
    }

    private calculateAverageProductivity(values: number[]) {
        if (values.length > 0 && values.length < 5) {
            const divisor = values.length
            return values.reduce((acc, curr) => acc + curr) / divisor
        } else {
            values.sort(function (a, b) {
                return a - b;
            });

            return values.slice(1, 4).reduce((acc, curr) => acc + curr) / 3
        }
    }

    public async getProductivity(payload: IAgritecPayload) {
        try {
            const url = process.env.AGRITEC_URL
            const pastHarvests = payload.simulacao.feature.properties.safras_passadas

            const requestsParams = pastHarvests.map((el: any) => {
                const expectation = payload.expectativaProdutividade
                    .find((e) => e.pam_rendmun_ano_safra === el.ano_safra)

                return {
                    idCultura: this.getCultureCode(payload.cultura),
                    idCultivar: el.cultivar,
                    cad: Math.floor(payload.cad),
                    codigoIBGE: payload.simulacao.county,
                    dataPlantio: el.data_plantio,
                    expectativaProdutividade: expectation.pam_rendmun_rend_ibge_max10anos,
                    latitude: payload.centroid.x,
                    longitude: payload.centroid.y
                }
            })

            const responses = await Promise.all(requestsParams.map(async (item: any) => {
                this.config.params = item
                let result = await axios.get(url, this.config)
                const lastIdx = result.data.data.produtividadeAlmejada.length - 1
                const productivity = result.data.data.produtividadeAlmejada[lastIdx]
                return productivity
            }))

            const averageProductivity = this.calculateAverageProductivity(responses)
            return averageProductivity
        } catch (error: any) {
            throw new Error(`Get Agritec Productivity error: ${error.message}`)
        }
    }

}