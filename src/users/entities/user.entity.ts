import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from "src/enums/user.role";
import { TimestampEntities } from "src/generics/timestamp.entities";
import { UserStatus } from "src/enums/user.status";

@Entity('user')
export class UserEntity extends TimestampEntities {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        nullable: false
    })
    username!: string;

    @Column({
        nullable: false,
        unique: true
    })
    email!: string;

    @Column({
        nullable: true
    })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role!: UserRole;

    @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.PENDING
    })
    status!: UserStatus;

    @Column({
        nullable: true
    })
    tel!: string;

    @Column({
        nullable: true
    })
    city!: string;

}
