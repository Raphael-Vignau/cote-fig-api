import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TimestampEntities } from "src/generics/timestamp.entities";
import { TagEntity } from "src/tags/entities/tag.entity";

@Entity("figurine")
export class FigurineEntity extends TimestampEntities {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        nullable: false
    })
    name!: string;

    @Column({
        nullable: true
    })
    description!: string;

    @Column({
        nullable: true
    })
    publisher!: string;

    @Column({
        nullable: true
    })
    artist!: string;

    @Column({
        nullable: true
    })
    game!: string;

    @Column({
        nullable: true
    })
    material!: string;

    @Column({
        nullable: true
    })
    scale!: string;

    @Column({
        nullable: true
    })
    year!: number;

    @Column({
        default: 0,
        nullable: true
    })
    rating!: number;

    @Column({
        default: 0,
        type: "float"
    })
    price!: number;

    @Column({
        nullable: true
    })
    img_original_name!: string;

    @Column({
        nullable: true
    })
    img_name!: string;

    @ManyToMany(() => TagEntity)
    @JoinTable()
    tags: TagEntity[];
}
