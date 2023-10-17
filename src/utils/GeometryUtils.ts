import { ICentroid, IGeometry } from "../ts";
const turf = require("@turf/turf")

export class GeometryUtils {

    constructor() { }

    public getCentroid(geometry: IGeometry) {
        try {
            const result = turf.centroid(geometry)
            const centroid: ICentroid = {
                x: result.geometry.coordinates[0],
                y: result.geometry.coordinates[1]
            }
            return centroid
        } catch (error: any) {
            throw new Error(`Geometry utils get centroid error: ${error.message}`)
        }
    }
}