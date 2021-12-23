import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { TimestampEntities } from "src/generics/timestamp.entities";
import { FigurineEntity } from "src/figurines/entities/figurine.entity";

@Entity("tag")
export class TagEntity extends TimestampEntities {

    @PrimaryColumn({
        nullable: false
    })
    name!: string;

    @Column({
        nullable: true,
        default: 0
    })
    rating!: number;

    @ManyToMany(() => FigurineEntity)
    figurines: FigurineEntity[];
}
