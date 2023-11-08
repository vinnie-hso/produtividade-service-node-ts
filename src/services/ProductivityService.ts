import { ICentroid, IGeometry, ISimulacao, IAgritecPayload } from "../ts";
import { GeometryUtils } from "../utils";
import { PronasolosService } from "./PronasolosService";
import { RendimentoMuncipioService } from "./RendimentoMunicipioService";
import { AgritecService } from "./AgritecService";

export class ProductivityService {
  simulation: ISimulacao
  harvestYears: string[]

  constructor() { }

  private hasPastHarvests(simulation: ISimulacao) {
    const harvestYears = simulation.feature.properties.safras_passadas
    if (!harvestYears) return false
    if (harvestYears.length > 0) this.harvestYears = harvestYears.map((el) => el.ano_safra)
    return harvestYears.length > 0
  }

  private async getIBGE5YearsAverage(simulation: ISimulacao) {
    try {
      const { municipio, cultura } = simulation
      let result = await new RendimentoMuncipioService().getRendimento5AnosByMunicipio(municipio, cultura)
      return result
    } catch (error: any) {
      throw new Error(`Get IBGE 5 Years Average error: ${error.message}`)
    }
  }

  private async getHistoricalProductivity(simulation: ISimulacao) {
    try {
      // * calcular media IBGE se não houver safras passadas
      let result
      if (!this.hasPastHarvests(simulation)) result = await this.getIBGE5YearsAverage(simulation)
      else {

        const { cultura, municipio } = simulation
        const geometry: IGeometry = simulation.feature.geometry

        const centroid: ICentroid = new GeometryUtils().getCentroid(geometry)

        const cadByCentroid: any = await new PronasolosService().getCADByCentroid(cultura, centroid)

        const municipalIncome = await new RendimentoMuncipioService().getRendimento10AnosByMunicipio(municipio, cultura, this.harvestYears)

        // * calcular produtividade pela agritec (requisições assíncronas)
        const payload: IAgritecPayload = {
          simulacao: simulation,
          cad: cadByCentroid.cadValue,
          centroid: centroid,
          cultura: cultura,
          expectativaProdutividade: municipalIncome,
        }

        result = await new AgritecService().getProdutividade(payload)
      }

      return {
        [simulation.id]: result
      }
    } catch (error: any) {
      console.log(`Get Historical Productivity error: ${error.message}`)
      return {
        [simulation.id]: error.message
      }
    }
  }

  public async calculate(simulation: ISimulacao) {
    return await this.getHistoricalProductivity(simulation)
  }
}
