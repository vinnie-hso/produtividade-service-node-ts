import { DataSource } from "typeorm";
import dataSource from "../database";
import { In } from 'typeorm';

export class MunicipalIncomeService {
    private dataSource: DataSource;

    constructor(database = dataSource) {
        this.dataSource = database;
    }

    public async get5YearsIncomeByCounty(county: any, culture: any) {
        try {
            let result
            if (culture === 'soja') result = await this.get5YearsSoyIncome(county, culture)
            else result = await this.get5YearsCornIncome(county, culture)

            if (result) {

                let total = result.slice(1, 4)
                    .reduce((accumulator: any, currentValue: any) => accumulator + currentValue.pam_rendmun_rend_ibge, 0)

                return total / parseFloat("3")
            }
        } catch (error: any) {
            throw new Error(`Get 5 Years Income by County error: ${error.message}`)
        }
    }

    private async get5YearsCornIncome(county: string, culture: string) {
        const query = this.dataSource.getRepository('MunicipioPam')
            .createQueryBuilder('tb_municipio_pam')
            .select(['pam_rendmun_ano_safra', 'pam_rendmun_rend_ibge'])
            .where('tb_municipio_pam.pam_rendmun_cod_ibge_mun = :municipio', { municipio: county })
            .andWhere(`LOWER(tb_municipio_pam.pam_rendmun_cultura) LIKE :cultura1`, {
                cultura1: `%${culture.split('_')[0].toLowerCase()}%`,
            })
            .andWhere(`LOWER(tb_municipio_pam.pam_rendmun_cultura) LIKE :cultura2`, {
                cultura2: `%${culture.split('_')[1].toLowerCase()}%`,
            })
            .orderBy('tb_municipio_pam.pam_rendmun_ano_safra', 'DESC')
            .limit(5);

        const result = await query.execute()
        return result;
    }

    private async get5YearsSoyIncome(county: string, culture: string) {
        const query = this.dataSource.getRepository('MunicipioPam')
            .createQueryBuilder('tb_municipio_pam')
            .select(['pam_rendmun_ano_safra', 'pam_rendmun_rend_ibge'])
            .where('pam_rendmun_cod_ibge_mun = :municipio', { municipio: county })
            .andWhere('LOWER(pam_rendmun_cultura) LIKE :cultura', { cultura: `%${culture.toLowerCase()}%` })
            .orderBy('pam_rendmun_ano_safra', 'DESC')
            .limit(5);

        const result = await query.execute()
        return result;
    }

    public async get10YearsIncomeByCounty(county: any, culture: any, harvestYears: string[]) {
        try {
            let result
            if (culture === 'soja') result = await this.get10YearsSoyIncome(county, culture, harvestYears)
            else result = await this.get10YearsCornIncome(county, culture, harvestYears)
            return result
        } catch (error: any) {
            throw new Error(`Get 10 Years Income by County error: ${error.message}`)
        }
    }

    private async get10YearsSoyIncome(county: string, culture: string, harvestYears: string[]) {
        const query = this.dataSource.getRepository('MunicipioPam')
            .createQueryBuilder('tb_municipio_pam')
            .select(['pam_rendmun_rend_ibge_max10anos', 'pam_rendmun_ano_safra'])
            .where('pam_rendmun_cod_ibge_mun = :municipio', { municipio: county })
            .andWhere({ pam_rendmun_ano_safra: In(harvestYears) })
            .andWhere(`LOWER(pam_rendmun_cultura) LIKE :cultura`, {
                cultura: `%${culture.toLowerCase()}%`,
            })
            .orderBy('pam_rendmun_ano_safra', 'DESC')

        const result = await query.execute()
        return result
    }

    private async get10YearsCornIncome(county: string, culture: string, harvestYears: string[]) {
        const query = this.dataSource.getRepository('MunicipioPam')
            .createQueryBuilder('tb_municipio_pam')
            .select(['pam_rendmun_rend_ibge_max10anos', 'pam_rendmun_ano_safra'])
            .where('pam_rendmun_cod_ibge_mun = :municipio', { municipio: county })
            .andWhere({ pam_rendmun_ano_safra: In(harvestYears) })
            .andWhere(`LOWER(tb_municipio_pam.pam_rendmun_cultura) LIKE :cultura1`, {
                cultura1: `%${culture.split('_')[0].toLowerCase()}%`,
            })
            .andWhere(`LOWER(tb_municipio_pam.pam_rendmun_cultura) LIKE :cultura2`, {
                cultura2: `%${culture.split('_')[1].toLowerCase()}%`,
            })
            .orderBy('pam_rendmun_ano_safra', 'DESC')

        const result = await query.execute()
        return result
    }
}