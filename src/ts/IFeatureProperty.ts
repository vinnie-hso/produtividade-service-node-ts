import { ISafraPassada } from "./ISafraPassada";

export interface IFeatureProperty {
    cultivar: string;
    estim_plantio: string;
    area_declarada: number;
    safras_passadas: ISafraPassada[];
}