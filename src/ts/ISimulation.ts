import { IFeature } from "./IFeature";
import { IIntegrity } from "./IIntegrity";

export interface ISimulation {
    id: any;
    culture: string | string[] | undefined;
    county: string | string[];
    feature: IFeature;
    integrity: IIntegrity;
}