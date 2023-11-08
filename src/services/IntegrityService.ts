import { DataSource } from "typeorm";
import dataSource from "../database";

import { IGeometry, ISimulacao } from "../ts";

export class IntegrityService {
    private dataSource: DataSource;

    constructor(database = dataSource) {
        this.dataSource = database;
    }

    // * 1. get area
    private async getArea(geometry: IGeometry) {
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

    // * 2. get integridade topológica
    private async getTopologicIntegrity(geometry: IGeometry) {
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

    public async validate(simulation: ISimulacao) {

        const geometry = simulation.feature.geometry
        const { invalid } = await this.getTopologicIntegrity(geometry)
        if (invalid) {
            simulation.integridade.isValidGeometry = false
            simulation.integridade.validationMessage = invalid
        }
        return simulation
    }

}