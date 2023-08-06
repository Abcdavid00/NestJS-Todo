import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Task } from 'src/task/task.entity';
import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Sprint {
    @PrimaryGeneratedColumn('uuid')
    @Field((type) => ID)
    id: string;

    @OneToMany(() => Task, task => task.sprint)
    @Field((type) => [Task], { nullable: true })
    tasks: Task[]

    @Column("nvarchar", { length: 50 })
    @Field((type) => String)
    name: string

    @Column("nvarchar", { length: 500, nullable: true })
    @Field((type) => String, { nullable: true })
    description: string

    @ManyToOne(() => User, user => user.administratingSprints)
    @Field((type) => User)
    admin: User

    @ManyToMany(() => User, user => user.joinedSprints)
    @JoinTable()
    @Field((type) => [User], { nullable: true })
    members: User[]

    @CreateDateColumn()
    @Field((type) => Date)
    createDate: Date

    @UpdateDateColumn()
    @Field((type) => Date)
    modifydDate: Date
}