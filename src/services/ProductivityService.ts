import { ICentroid, IGeometry, ISimulacao, IAgritecPayload } from "../ts";
import { GeometryUtils } from "../utils";
import { PronasolosService } from "./PronasolosService";
import { MunicipalIncomeService } from "./MunicipalIncomeService";
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
      let result = await new MunicipalIncomeService().get5YearsIncomeByCounty(municipio, cultura)
      return result
    } catch (error: any) {
      throw new Error(`Get IBGE 5 Years Average error: ${error.message}`)
    }
  }

  private async getHistoricalProductivity(simulation: ISimulacao) {
    try {
      // * calculate IBGE average if not past harvests
      let result
      if (!this.hasPastHarvests(simulation)) result = await this.getIBGE5YearsAverage(simulation)
      else {

        const { cultura, municipio } = simulation
        const geometry: IGeometry = simulation.feature.geometry

        const centroid: ICentroid = new GeometryUtils().getCentroid(geometry)

        const cadByCentroid: any = await new PronasolosService().getCADByCentroid(cultura, centroid)

        const municipalIncome = await new MunicipalIncomeService().get10YearsIncomeByCounty(municipio, cultura, this.harvestYears)

        // * calculate productivity by Agritec (async requests)
        const payload: IAgritecPayload = {
          simulacao: simulation,
          cad: cadByCentroid.cadValue,
          centroid: centroid,
          cultura: cultura,
          expectativaProdutividade: municipalIncome,
        }

        result = await new AgritecService().getProductivity(payload)
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
