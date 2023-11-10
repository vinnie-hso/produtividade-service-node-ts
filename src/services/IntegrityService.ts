import { DataSource } from "typeorm";
import dataSource from "../database";

import { IGeometry, ISimulation, IIntegrityService } from "../ts";

export class IntegrityService implements IIntegrityService {
    private dataSource: DataSource;

    constructor(database: DataSource = dataSource) {
        this.dataSource = database;
    }

    async getArea(geometry: IGeometry) {
        try {
            const shape = JSON.stringify(geometry);
            const queryRunner = this.dataSource.createQueryRunner()
            await queryRunner.connect()
            const result = await queryRunner.manager.query(`SELECT ST_AREA(ST_GeomFromGeoJSON('${shape}'), true) AS totalArea`)
            await queryRunner.release()
            return result;
        } catch (error: any) {
            throw new Error(`Get Area error: ${error.message}`)
        }
    }

    async getTopologicIntegrity(geometry: IGeometry) {
        try {
            const shape = JSON.stringify(geometry);
            const queryRunner = this.dataSource.createQueryRunner()
            await queryRunner.connect()
            const result = await queryRunner.manager.query(`SELECT reason(ST_IsValidDetail(ST_GeomFromGeoJSON('${shape}'))) AS invalid`)
            await queryRunner.release()
            return result[0];
        } catch (error: any) {
            throw new Error(`Get Topologic Integrity error: ${error.message}`)
        }
    }

    async validate(simulation: ISimulation) {

        const geometry = simulation.feature.geometry
        const { invalid } = await this.getTopologicIntegrity(geometry)
        if (invalid) {
            simulation.integrity.isValidGeometry = false
            simulation.integrity.validationMessage = invalid
        }
        return simulation
    }

}