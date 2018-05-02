import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";

@Entity()
export class Client {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    srcId: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    role: string;
}