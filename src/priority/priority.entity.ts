import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class Priority {
    @PrimaryGeneratedColumn("uuid")
    @Field((type) => ID)
    id: string;

    @Column()
    @Field()
    name: string;
}