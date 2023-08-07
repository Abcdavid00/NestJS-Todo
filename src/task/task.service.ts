import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Priority } from 'src/priority/priority.entity';
import { Sprint } from 'src/sprint/sprint.entity';
import { User } from 'src/user/user.entity';
import { isNullOrUndefined } from 'util';

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
      members: true,
    },
  };

  async getTask(id: string): Promise<Task> {
    return this.taskRepository.findOne({
      where: { id },
      ...this.taskRelationOptions,
    });
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

  async filterTasks(
    sprint: Sprint,
    priority: string,
    status: string,
  ): Promise<Task[]> {
    const priorityWhereOption: FindOptionsWhere<Task> =
      priority === null || priority === undefined
        ? {}
        : { priority: { name: priority } };
    const statusWhereOption: FindOptionsWhere<Task> =
      status === null || status === undefined ? {} : { status };
    const whereOption: FindOptionsWhere<Task> = {
      sprint: {
        id: sprint.id,
      },
      ...priorityWhereOption,
      ...statusWhereOption,
    };
    const tasks = await this.taskRepository.find({
      where: whereOption,
      relations: {
        priority: true,
        members: true,
      }
    });
    return tasks;
  }

  sortTasks(
    tasks: Task[],
    sortBy: string,
    asc: boolean,
  ): Task[] {
    if (tasks[0][sortBy] === null || tasks[0][sortBy] === undefined) {
      throw new MethodNotAllowedException(`Sort tasks by ${sortBy} is not allowed`)
    }
    if (sortBy === 'priority') {
      const sortedTasks = tasks.sort((a, b) => {
        if (a[sortBy].name < b[sortBy].name) {
          return asc ? -1 : 1;
        }
        if (a[sortBy].name > b[sortBy].name) {
          return asc ? 1 : -1;
        }
        return 0;
      });
      return sortedTasks;
    }
    const sortedTasks = tasks.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return asc ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return asc ? 1 : -1;
      }
      return 0;
    });
    return sortedTasks;
  }
}
