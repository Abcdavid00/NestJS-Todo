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
import { type } from 'os';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id: string;

  @Column('varchar', { length: 200 })
  password: string;

  @Column('varchar', { length: 20 })
  @Field((type) => String)
  username: string;

  @Column('varchar', { length: 200 })
  @Field((type) => String)
  email: string;

  @Column('nvarchar', { length: 50 })
  @Field((type) => String)
  displayName: string;

  @Column('varchar', { length: 10, nullable: true })
  @Field(() => String,{
    nullable: true,
  })
  phone?: string;

  @ManyToMany(() => Task, (task) => task.members)
  // @JoinTable()
  @Field((type) => [Task], { nullable: true})
  tasks: Task[];

  @OneToMany(() => Sprint, sprint => sprint.admin)
  @Field((type) => [Sprint], { nullable: true})
  administratingSprints: Sprint[];

  @ManyToMany(() => Sprint, sprint => sprint.members)
  @Field((type) => [Sprint], { nullable: true})
  // @JoinTable()
  joinedSprints: Sprint[];

  @CreateDateColumn()
  @Field((type) => Date)
  createDate: Date

  @UpdateDateColumn()
  @Field((type) => Date)
  modifydDate: Date
}
