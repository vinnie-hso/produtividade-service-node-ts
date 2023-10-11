import { ICentroid, IGeometry } from "../ts";
const turf = require("@turf/turf")

export class GeometryUtils {

    constructor() { }

    public getCentroid(geometry: IGeometry): ICentroid {
        const result = turf.centroid(geometry)
        const centroid: ICentroid = {
            x: result.geometry.coordinates[0],
            y: result.geometry.coordinates[1]
        }
        return centroid
    }
}