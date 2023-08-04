import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../task/task.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id: string;

  @Column()
  password: string;

  @Column()
  @Field()
  username: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  displayName: string;

  @Column({
    nullable: true,
  })
  @Field({
    nullable: true,
  })
  phone?: string;

  // @ManyToMany(() => Task, (task) => task.members)
  // @JoinTable()
  // tasks: Task[];
}
