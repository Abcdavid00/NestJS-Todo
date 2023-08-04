import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Priority } from '../priority/priority.entity';
import { User } from "src/user/user.entity";


@Entity()
@ObjectType()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    @Field((type) => ID)
    id: string;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    description: string;

    @Column()
    @Field()
    createDate: string;

    @Column()
    @Field()
    modifydDate: string;

    @Column()
    @Field()
    expireDay: string;

    @Column()
    @Field()
    priority: Priority;

    // @ManyToMany(() => User, user => user.tasks)
    // // @Field()
    // @JoinTable()
    // members: User[];


}