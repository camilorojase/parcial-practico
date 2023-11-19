
import { AirlineEntity } from "../airline/airline.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class AirportEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    name: string;

    @Column()
    code: string;

    @Column()
    country: string;

    @Column()
    city: string;

    @ManyToMany(() => AirlineEntity, airline => airline.airports)
    airlines: AirlineEntity[];
}
