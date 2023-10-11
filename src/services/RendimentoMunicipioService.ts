import { DataSource } from "typeorm";
import dataSource from "../database";
import { In } from 'typeorm';

export class RedimentoMuncipioService {
    dataSource: DataSource;

    constructor(database = dataSource) {
        this.dataSource = database;
    }

    public async getRendimento5AnosByMunicipio(municipio: any, cultura: any) {
        let result
        if (cultura === 'soja') result = await this.getRedimento5AnosSoja(municipio, cultura)
        else result = await this.getRendimento5AnosMilho(municipio, cultura)

        if (result) {

            let total = result.slice(1, 4)
                .reduce((accumulator: any, currentValue: any) => accumulator + currentValue.pam_rendmun_rend_ibge, 0)

            return total / parseFloat("3")
        }
    }

    private async getRendimento5AnosMilho(municipio: string, cultura: string) {
        const query = this.dataSource.getRepository('MunicipioPam')
            .createQueryBuilder('tb_municipio_pam')
            .select(['pam_rendmun_ano_safra', 'pam_rendmun_rend_ibge'])
            .where('tb_municipio_pam.pam_rendmun_cod_ibge_mun = :municipio', { municipio })
            .andWhere(`LOWER(tb_municipio_pam.pam_rendmun_cultura) LIKE :cultura1`, {
                cultura1: `%${cultura.split('_')[0].toLowerCase()}%`,
            })
            .andWhere(`LOWER(tb_municipio_pam.pam_rendmun_cultura) LIKE :cultura2`, {
                cultura2: `%${cultura.split('_')[1].toLowerCase()}%`,
            })
            .orderBy('tb_municipio_pam.pam_rendmun_ano_safra', 'DESC')
            .limit(5);

        const result = await query.execute()
        return result;
    }

    private async getRedimento5AnosSoja(municipio: string, cultura: string) {
        const query = this.dataSource.getRepository('MunicipioPam')
            .createQueryBuilder('tb_municipio_pam')
            .select(['pam_rendmun_ano_safra', 'pam_rendmun_rend_ibge'])
            .where('pam_rendmun_cod_ibge_mun = :municipio', { municipio })
            .andWhere('LOWER(pam_rendmun_cultura) LIKE :cultura', { cultura: `%${cultura.toLowerCase()}%` })
            .orderBy('pam_rendmun_ano_safra', 'DESC')
            .limit(5);

        const result = await query.execute()
        return result;
    }

    public async getRendimento10AnosByMunicipio(municipio: any, cultura: any, anosSafras: string[]) {
        let result
        if (cultura === 'soja') result = await this.getRendimento10AnosSoja(municipio, cultura, anosSafras)
        else result = await this.getRendimento10AnosMilho(municipio, cultura, anosSafras)
        
        return result
    }

    private async getRendimento10AnosSoja(municipio: string, cultura: string, anosSafras: string[]) {
        const query = this.dataSource.getRepository('MunicipioPam')
            .createQueryBuilder('tb_municipio_pam')
            .select(['pam_rendmun_rend_ibge_max10anos', 'pam_rendmun_ano_safra'])
            .where('pam_rendmun_cod_ibge_mun = :municipio', { municipio })
            .andWhere({ pam_rendmun_ano_safra: In(anosSafras) })
            .andWhere(`LOWER(pam_rendmun_cultura) LIKE :cultura`, {
                cultura: `%${cultura.toLowerCase()}%`,
            })
            .orderBy('pam_rendmun_ano_safra', 'DESC')

        const result = await query.execute()
        return result
    }


    private async getRendimento10AnosMilho(municipio: string, cultura: string, anosSafras: string[]) {
        const query = this.dataSource.getRepository('MunicipioPam')
            .createQueryBuilder('tb_municipio_pam')
            .select(['pam_rendmun_rend_ibge_max10anos', 'pam_rendmun_ano_safra'])
            .where('pam_rendmun_cod_ibge_mun = :municipio', { municipio })
            .andWhere({ pam_rendmun_ano_safra: In(anosSafras) })
            .andWhere(`LOWER(tb_municipio_pam.pam_rendmun_cultura) LIKE :cultura1`, {
                cultura1: `%${cultura.split('_')[0].toLowerCase()}%`,
            })
            .andWhere(`LOWER(tb_municipio_pam.pam_rendmun_cultura) LIKE :cultura2`, {
                cultura2: `%${cultura.split('_')[1].toLowerCase()}%`,
            })
            .orderBy('pam_rendmun_ano_safra', 'DESC')

        const result = await query.execute()
        return result
    }
}