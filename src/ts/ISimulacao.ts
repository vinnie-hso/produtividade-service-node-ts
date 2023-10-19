import { IFeature } from "./IFeature";
import { IIntegridade } from "./IIntegridade";

export interface ISimulacao {
    id: any;
    cultura: string | string[] | undefined;
    municipio: string | string[];
    feature: IFeature;
    integridade: IIntegridade;
}