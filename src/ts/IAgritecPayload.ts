import { ISimulacao } from "./ISimulacao";
import { ICentroid } from "./ICentroid";

export interface IAgritecPayload {
    simulacao: ISimulacao;
    cad: number;
    centroid: ICentroid;
    cultura: string | string[] | undefined;
    expectativaProdutividade: any[]
  }