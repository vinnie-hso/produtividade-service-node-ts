import { IFeature } from "./IFeature";
import { IIntegridade } from "./IIntegridade";

export interface ISimulation {
    id: any;
    culture: string | string[] | undefined;
    county: string | string[];
    feature: IFeature;
    integrity: IIntegridade;
}