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
    if (safrasPassadas.length > 0) this.anosSafras = safrasPassadas.map((el) => el.ano_safra)
    return safrasPassadas.length > 0
  }

  private async getMediaIBGE5Anos(simulacao: ISimulacao) {
    const { municipio, cultura } = simulacao
    let result = await new RedimentoMuncipioService().getRendimento5AnosByMunicipio(municipio, cultura)
    return result
  }

  private async getProdutividadeHistorica(simulacao: ISimulacao) {

    const { id, cultura } = simulacao
    const geometry: IGeometry = simulacao.feature.geometry

    // pegar centroid da geometria (eixo x e y) 
    const centroid: ICentroid = new GeometryUtils().getCentroid(geometry)

    // buscar dados de CAD a informando a cultura
    const cadByCentroid: any = await new PronasolosService().getCADByCentroid(cultura, centroid)

    // * calcular media IBGE se não houver safras passadas
    let result
    if (!this.hasSafrasPassadas(simulacao)) result = this.getMediaIBGE5Anos(simulacao)
    else {
      const { municipio, cultura } = simulacao

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
      [id]: result
    }
  }

  public async calculate(simulacao: ISimulacao) {
    try {
      return await this.getProdutividadeHistorica(simulacao)
    } catch (error) {
      console.log(`Produtividade Service Calculate error: ${error}`)
    }
  }
}
