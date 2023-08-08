import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class TaskFilterDto {
  @Field(() => String)
  @IsNotEmpty()
  sprintId: string;

  @Field(() => String, {nullable: true})
  @IsOptional()
  keyword: string;

  @Field(() => [String], {nullable: true})
  @IsOptional()
  @IsNotEmpty()
  priority: string[];

  @Field(() => [String], {nullable: true})
  @IsOptional()
  @IsNotEmpty()
  status: string[];
}

@InputType()
export class TaskSortDto {
  @Field(() => String, {nullable: true})
  @IsOptional()
  @IsNotEmpty()
  sortBy: string;

  @Field(() => Boolean, {nullable: true ,defaultValue: true})
  @IsOptional()
  @IsBoolean()
  asc: boolean;
}
