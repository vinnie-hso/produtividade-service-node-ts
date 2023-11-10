import dataSource from "../database";
import { DataSource } from "typeorm";
import { ICentroid } from "../ts";

export class PronasolosService {
    private dataSource: DataSource;

    constructor(database: DataSource = dataSource) {
        this.dataSource = database;
    }

    public async getCADByCentroid(culture: any, centroid: ICentroid) {
        try {
            const columnCad = this.getColumnCAD(culture)
            const query = this.dataSource.getRepository("SoloPronasolos").createQueryBuilder()
                .select(`SoloPronasolos.${columnCad}`, "cadValue")
                .where(`ST_Intersects(ST_GeomFromText('POINT (${centroid.x} ${centroid.y})', 4326), spr_sp_pl)`)

            const result = await query.execute()
            return result[0];
        } catch (error: any) {
            throw new Error(`Get CAD by centroid error: ${error.message}`)
        }
    }

    private getColumnCAD(culture: string) {
        if (culture === 'soja')
            return 'spr_cad_soja'
        else if (culture === 'milho_1' || culture === 'milho_2')
            return 'spr_cad_milho'
    }
}