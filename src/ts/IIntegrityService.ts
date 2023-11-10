import { IGeometry } from "./IGeometry";
import { ISimulation } from "./ISimulation";

export interface IIntegrityService {
    getArea (geometry: IGeometry): Promise<any>;
    getTopologicIntegrity (geometry: IGeometry): Promise<any>;
    validate (simulation: ISimulation): Promise<any>;
}