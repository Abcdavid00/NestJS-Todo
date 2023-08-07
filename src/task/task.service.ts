import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority } from 'src/priority/priority.entity';
import { Sprint } from 'src/sprint/sprint.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(
    name: string,
    description: string,
    status: string,
    sprint: Sprint,
    priority: Priority,
    expireDate: Date,
  ): Promise<Task> {
    const task = this.taskRepository.create({
      name,
      description,
      status,
      sprint,
      priority,
      expireDate,
    });
    return this.taskRepository.save(task);
  }

  async deleteTask(id: string): Promise<DeleteResult> {
    const task = await this.getTask(id);
    return this.taskRepository.delete(task.id);
  }

  taskRelationOptions = {
    relations: {
        sprint: true,
        priority: true,
        members: true
    }
  };

  async getTask(id: string): Promise<Task> {
    return this.taskRepository.findOne({ where: { id }, ...this.taskRelationOptions });
  }

  async addMembers(task: Task, members: User[]): Promise<Task> {
    const memIds = task.members.map((member) => member.id);
    const newMembers = members.filter((member) => !memIds.includes(member.id));
    task.members = [...task.members, ...newMembers];
    return this.taskRepository.save(task);
  }

  async removeMembers(task: Task, members: User[]): Promise<Task> {
    const memIds = members.map((member) => member.id);
    task.members = task.members.filter((member) => !memIds.includes(member.id));
    return this.taskRepository.save(task);
  }

  async modifyTask(
    task: Task,
    name: string,
    description: string,
    status: string,
    priority: Priority,
    expireDate: Date,
  ): Promise<Task> {
    task.name = name;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.expireDate = expireDate;
    return this.taskRepository.save(task);
  }
}
