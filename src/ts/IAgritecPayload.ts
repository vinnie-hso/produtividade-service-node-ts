import { ISimulation } from "./ISimulation";
import { ICentroid } from "./ICentroid";

export interface IAgritecPayload {
    simulacao: ISimulation;
    cad: number;
    centroid: ICentroid;
    cultura: string | string[] | undefined;
    expectativaProdutividade: any[]
  }