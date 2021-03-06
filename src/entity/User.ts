import { Entity, PrimaryColumn, Column, BeforeInsert, BaseEntity } from "typeorm";
import * as uuidv4 from 'uuid/v4';
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User extends BaseEntity {

    @PrimaryColumn('uuid') id: string;

    @Column('varchar', { length: 255 })
    email: string;

    @Column('text')
    password: string;

    @Column('boolean', { default: false })
    confirmed: boolean;

    @BeforeInsert() addId() {
        this.id = uuidv4();
    }

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}
