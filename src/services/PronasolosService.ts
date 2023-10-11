import dataSource from "../database";
import { DataSource } from "typeorm";
import { ICentroid } from "../ts";

export class PronasolosService {
    dataSource: DataSource;

    constructor(database = dataSource) {
        this.dataSource = database;
    }

    public async getCADByCentroid(cultura: any, centroid: ICentroid) {

        const columnCad = this.getColumnCAD(cultura)
        const query = this.dataSource.getRepository("SoloPronasolos").createQueryBuilder()
            .select(`SoloPronasolos.${columnCad}`, "cadValue")
            .where(`ST_Intersects(ST_GeomFromText('POINT (${centroid.x} ${centroid.y})', 4326), spr_sp_pl)`)

        const result = await query.execute()
        return result[0];
    }

    private getColumnCAD(cultura: string) {
        if (cultura === 'soja')
            return 'spr_cad_soja'
        else if (cultura === 'milho_1' || cultura === 'milho_2')
            return 'spr_cad_milho'
    }
}