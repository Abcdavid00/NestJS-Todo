import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Priority } from '../priority/priority.entity';
import { User } from "src/user/user.entity";
import { Sprint } from "src/sprint/sprint.entity";

@Entity()
@ObjectType()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    @Field((type) => ID)
    id: string;

    @Column("nvarchar", { length: 64 })
    @Field((type) => String)
    name: string;

    @Column("text", { nullable: true })
    @Field((type) => String, { nullable: true })
    description: string;

    @CreateDateColumn()
    @Field((type) => Date)
    createDate: Date

    @UpdateDateColumn()
    @Field((type) => Date)
    modifydDate: Date

    @Column("datetime", { nullable: true })
    @Field((type) => Date, { nullable: true })
    expireDate: Date;

    @Column("varchar", { length:32, default: "UNPICK" })
    @Field((type) => String)
    status: string;

    @ManyToOne(() => Priority)
    @Field((type) => Priority)
    priority: Priority;

    @ManyToMany(() => User, user => user.tasks)
    @JoinTable()
    @Field((type) => [User], { nullable: true })
    members: User[];

    @ManyToOne(() => Sprint, sprint => sprint.tasks)
    @Field((type) => Sprint)
    sprint: Sprint;

}
