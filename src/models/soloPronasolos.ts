import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity("tb_solo_pronasolo")
export default class SoloPronasolos {
    @PrimaryGeneratedColumn()
    spr_index!: string;

    @Column({ type: 'int' })
    spr_cad_soja: number;

    @Column({ type: 'int' })
    spr_cad_milho: number;

    @Column({ type: 'geography', spatialFeatureType: 'MultiPolygon', srid: 4326 })
    spr_sp_pl: string; 
}

