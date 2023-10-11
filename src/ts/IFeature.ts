import { IFeatureProperty } from "./IFeatureProperty";
import { IGeometry } from "./IGeometry";

export interface IFeature {
    type: string;
    id: number;
    properties: IFeatureProperty;
    geometry: IGeometry;
}