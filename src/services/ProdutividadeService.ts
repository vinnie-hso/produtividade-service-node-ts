import { DataSource } from "typeorm";
import { ICentroid, IGeometry, ISimulacao, IAgritecPayload } from "../ts";
import { GeometryUtils } from "../utils";
import dataSource from "../database";
import { PronasolosService } from "./PronasolosService";
import { RedimentoMuncipioService } from "./RendimentoMunicipioService";
import { AgritecService } from "./AgritecService";

export class ProdutividadeService {
  dataSource: DataSource;
  simulacao: ISimulacao
  anosSafras: string[]

  constructor(database = dataSource) {
    this.dataSource = database;
  }

  private hasSafrasPassadas(simulacao: ISimulacao) {
    const safrasPassadas = simulacao.feature.properties.safras_passadas
    if (!safrasPassadas) return false
    if (safrasPassadas.length > 0) this.anosSafras = safrasPassadas.map((el) => el.ano_safra)
    return safrasPassadas.length > 0
  }

  private async getMediaIBGE5Anos(simulacao: ISimulacao) {
    try {
      const { municipio, cultura } = simulacao
      let result = await new RedimentoMuncipioService().getRendimento5AnosByMunicipio(municipio, cultura)
      return result
    } catch (error: any) {
      throw new Error(`Get Media IBGE 5 Anos error: ${error.message}`)
    }
  }

  private async getProdutividadeHistorica(simulacao: ISimulacao) {
    try {
      // * calcular media IBGE se não houver safras passadas
      let result
      if (!this.hasSafrasPassadas(simulacao)) result = await this.getMediaIBGE5Anos(simulacao)
      else {

        const { cultura, municipio } = simulacao
        const geometry: IGeometry = simulacao.feature.geometry

        const centroid: ICentroid = new GeometryUtils().getCentroid(geometry)

        const cadByCentroid: any = await new PronasolosService().getCADByCentroid(cultura, centroid)

        const rendimentoMunicipio = await new RedimentoMuncipioService().getRendimento10AnosByMunicipio(municipio, cultura, this.anosSafras)

        // * calcular produtividade pela agritec (requisições assíncronas)
        const payload: IAgritecPayload = {
          simulacao: simulacao,
          cad: cadByCentroid.cadValue,
          centroid: centroid,
          cultura: cultura,
          expectativaProdutividade: rendimentoMunicipio,
        }

        result = await new AgritecService().getProdutividade(payload)
      }

      return {
        [simulacao.id]: result
      }
    } catch (error: any) {
      console.log(`Get Produtividade Histórica error: ${error.message}`)
      return {
        [simulacao.id]: error.message
      }
    }
  }

  public async calculate(simulacao: ISimulacao) {
    return await this.getProdutividadeHistorica(simulacao)
  }
}
