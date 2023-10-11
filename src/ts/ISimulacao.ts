import { IFeature } from "./IFeature";

export interface ISimulacao {
    id: any;
    cultura: string | string[] | undefined;
    municipio: string | string[];
    feature: IFeature;
}