import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Task } from 'src/task/task.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Sprint {
    @PrimaryGeneratedColumn('uuid')
    @Field((type) => ID)
    id: string;

    @Column()
    // @Field()
    task: Task[]

    @Column()
    @Field()
    description: string

    @Column()
    @Field()
    admin: User

    @Column()
    // @Field()
    members: User[]

    @Column()
    @Field()
    createDate: string

    @Column()
    @Field()
    modifydDate: string
}