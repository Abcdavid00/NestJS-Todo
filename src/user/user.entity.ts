import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../task/task.entity';
import { Sprint } from 'src/sprint/sprint.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id: string;

  @Column('varchar', { length: 200 })
  password: string;

  @Column('varchar', { length: 20 })
  @Field()
  username: string;

  @Column('varchar', { length: 200 })
  @Field()
  email: string;

  @Column('varchar', { length: 50 })
  @Field()
  displayName: string;

  @Column('varchar', { length: 10, nullable: true })
  @Field(() => String,{
    nullable: true,
  })
  phone?: string;

  @ManyToMany(() => Task, (task) => task.members)
  @Field((type) => [Task], { nullable: true})
  @JoinTable()
  tasks: Task[];

  @OneToMany(() => Sprint, sprint => sprint.admin)
  @Field((type) => [Sprint], { nullable: true})
  administratedSprints: Sprint[];

  @ManyToMany(() => Sprint, sprint => sprint.members)
  @Field((type) => [Sprint], { nullable: true})
  @JoinTable()
  joinedSprints: Sprint[];

  @CreateDateColumn()
  @Field((type) => Date)
  createDate: Date

  @UpdateDateColumn()
  @Field((type) => Date)
  modifydDate: Date
}
