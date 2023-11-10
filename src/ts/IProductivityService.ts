import { ISimulation } from "./ISimulation"

export interface IProductivityService {
    hasPastHarvests (simulation: ISimulation): Boolean;
    getIBGE5YearsAverage (simulation: ISimulation): Promise<any>;
    getHistoricalProductivity (simulation: ISimulation): Promise<any>;
    calculate (simulation: ISimulation): Promise<any>;
}