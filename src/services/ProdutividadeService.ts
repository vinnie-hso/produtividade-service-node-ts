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

  private hasSafrasPassadas() {
    const safrasPassadas = this.simulacao.feature.properties.safras_passadas
    if (safrasPassadas.length > 0) this.anosSafras = safrasPassadas.map((el) => el.ano_safra)
    return safrasPassadas.length > 0
  }

  private async getMediaIBGE5Anos() {
    const { municipio, cultura } = this.simulacao
    let result = await new RedimentoMuncipioService().getRendimento5AnosByMunicipio(municipio, cultura)
    return result
  }

  private async getProdutividadeHistorica(simulacao: ISimulacao) {

    // console.log("Simulacao: ", this.simulacao)
    // const { id, cultura } = this.simulacao
    // const geometry: IGeometry = this.simulacao.feature.geometry

    const { id, cultura } = simulacao
    const geometry: IGeometry = simulacao.feature.geometry

    // pegar centroid da geometria (eixo x e y) 
    const centroid: ICentroid = new GeometryUtils().getCentroid(geometry)

    // buscar dados de CAD a informando a cultura
    const cadByCentroid: any = await new PronasolosService().getCADByCentroid(cultura, centroid)

    // * calcular media IBGE se não houver safras passadas
    let result
    if (!this.hasSafrasPassadas()) result = this.getMediaIBGE5Anos()
    else {

      // const { municipio, cultura } = this.simulacao
      const { municipio, cultura } = simulacao
      const rendimentoMunicipio = await new RedimentoMuncipioService().getRendimento10AnosByMunicipio(municipio, cultura, this.anosSafras)

      // * calcular produtividade pela agritec (requisições assíncronas)
      const payload: IAgritecPayload = {
        // simulacao: this.simulacao,
        simulacao: simulacao,
        cad: cadByCentroid.cadValue,
        centroid: centroid,
        cultura: cultura,
        expectativaProdutividade: rendimentoMunicipio,
      }

      result = await new AgritecService().getProdutividade(payload)
      // console.log(payload, result)
    }

    // return String(`"${this.simulacao.feature.id}": ${result}`)
    
    return {
      [id]: result
    }
  }

  public async calculate(simulacao: ISimulacao) {
    try {
      // this.simulacao = simulacao
      return await this.getProdutividadeHistorica(simulacao)
    } catch (error) {
      console.log(`Produtividade Service Calculate error: ${error}`)
    }
  }
}
