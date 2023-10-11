const axios = require('axios')
import { IAgritecPayload } from "../ts";

export class AgritecService {

    config

    constructor(
        config = {
            headers: {
                Authorization: `Bearer ${process.env.AGRITEC_API_KEY}`,
            },
            params: {}
        }
    ) {
        this.config = config
    }

    private getCulturaCode(cultura: any) {
        if (cultura === "soja") return 60
        if (cultura === "milho_1" || cultura === "milho_2") return 56
    }

    private calculateProdutividadeMedia(values: number[]) {
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

    public async getProdutividade(payload: IAgritecPayload) {
        try {

            const url = process.env.AGRITEC_URL
            const safrasPassadas = payload.simulacao.feature.properties.safras_passadas

            const requestsParams = safrasPassadas.map((el) => {
                const expectativa = payload.expectativaProdutividade
                    .find((e) => e.pam_rendmun_ano_safra === el.ano_safra)

                return {
                    idCultura: this.getCulturaCode(payload.cultura),
                    idCultivar: el.cultivar,
                    cad: Math.floor(payload.cad),
                    codigoIBGE: payload.simulacao.municipio,
                    dataPlantio: el.data_plantio,
                    expectativaProdutividade: expectativa.pam_rendmun_rend_ibge_max10anos,
                    latitude: payload.centroid.x,
                    longitude: payload.centroid.y
                }
            })

            const responses = await Promise.all(requestsParams.map(async (item) => {
                this.config.params = item
                let result = await axios.get(url, this.config)
                const lastIdx = result.data.data.produtividadeAlmejada.length - 1
                const produtividade = result.data.data.produtividadeAlmejada[lastIdx]
                return produtividade
            }))

            const produtividadeMedia = this.calculateProdutividadeMedia(responses)
            return produtividadeMedia
        } catch (error) {
            console.error(error)
        }
    }

}