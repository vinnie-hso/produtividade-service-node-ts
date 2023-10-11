import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity("tb_municipio_pam")
export default class MunicipioPam {
    @PrimaryGeneratedColumn()
    pam_index!: string;

    @Column({ type: 'varchar' })
    pam_rendmun_cod_ibge_mun: string;

    @Column({ type: 'varchar' })
    pam_rendmun_cultura: string;

    @Column({ type: 'int' })
    pam_rendmun_rend_ibge: number;    

    @Column({ type: 'varchar' })
    pam_rendmun_ano_safra: string;
}

