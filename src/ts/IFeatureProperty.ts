import { IPastHarvest } from "./IPastHarvest";

export interface IFeatureProperty {
    cultivar: string;
    estim_plantio: string;
    area_declarada: number;
    safras_passadas: IPastHarvest[];
}