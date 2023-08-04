import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Coffee {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  sPrice: number;

  @Column()
  @Field()
  mPrice: number;
  
  @Column()
  @Field()
  lPrice: number;

  @Column()
  @Field()
  description: string;
  // @Column()
  // createdAt: string;
}
