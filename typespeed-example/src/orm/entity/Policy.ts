import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn} from "typeorm";
import { ColumnMetadata } from "typeorm/metadata/ColumnMetadata";

@Entity()
export class Policy {
    @ObjectIdColumn()
    id: string;

    @Column()
    srcId: string;

    @Column()
    amountInsuted: number;

    @Column()
    email: string;

    @Column()
    inceptionDate: string;

    @Column()
    installmentPayment: boolean;

    @Column() 
    clientId: string;
}
