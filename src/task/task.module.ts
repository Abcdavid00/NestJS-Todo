import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { SprintModule } from 'src/sprint/sprint.module';
import { Priority } from 'src/priority/priority.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    Priority,
    UserModule
  ],
  providers: [TaskService, TaskResolver],
  exports: [TaskService]
})
export class TaskModule {}
