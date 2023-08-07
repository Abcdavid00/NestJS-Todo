import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Sprint } from './sprint.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from '../user/user.service';
import { Priority } from 'src/priority/priority.entity';
import { TaskService } from 'src/task/task.service';
import { PriorityService } from 'src/priority/priority.service';
import { Task } from 'src/task/task.entity';

@Injectable()
export class SprintService {
  constructor(
    @InjectRepository(Sprint)
    private readonly sprintRepository: Repository<Sprint>,
    private readonly userService: UserService,
    private readonly priorityService: PriorityService,
    private readonly taskService: TaskService,
  ) {}

  async createSprint(
    name: string,
    description: string,
    admin: User,
  ): Promise<Sprint> {
    admin = await this.userService.getUser(admin.id);
    const members: User[] = [admin];
    const sprint = this.sprintRepository.create({
      name,
      description,
      admin,
      members,
    });
    return this.sprintRepository.save(sprint);
  }

  sprintRelationOptions: FindOneOptions<Sprint> = {
    relations: {
      admin: true,
      members: true,
      tasks: true,
    },
  };

  async getSprint(id: string): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne({ where: { id }, ...this.sprintRelationOptions});
    if (!sprint) {
      throw new Error('Sprint not found');
    }
    return sprint;
  }

  async addMembers(sprint: Sprint, members: User[]): Promise<Sprint> {
    const memIds = sprint.members.map((member) => member.id);
    const newMembers = members.filter((member) => !memIds.includes(member.id));
    sprint.members = [...sprint.members, ...newMembers];
    return this.sprintRepository.save(sprint);
  }

  async removeMembers(sprint: Sprint, members: User[]): Promise<Sprint> {
    const memIds = members.map((member) => member.id);
    sprint.members = sprint.members.filter(
      (member) => !memIds.includes(member.id),
    );
    return this.sprintRepository.save(sprint);
  }

  async modifySprint(
    sprint: Sprint,
    name: string,
    description: string,
  ): Promise<Sprint> {
    sprint.name = name;
    sprint.description = description;
    return this.sprintRepository.save(sprint);
  }

  async addTask(
    sprint: Sprint,
    name: string,
    description: string,
    priority: Priority,
    expireDate: Date,
  ): Promise<Sprint> {
    const task = await this.taskService.createTask(
      name,
      description,
      sprint,
      priority,
      expireDate,
    );
    sprint.tasks = [...sprint.tasks, task];
    return this.sprintRepository.save(sprint);
  }

  async removeTask(sprint: Sprint, taskId: string): Promise<Sprint> {
    sprint.tasks = sprint.tasks.filter((task) => task.id !== taskId);
    await this.taskService.deleteTask(taskId);
    return this.sprintRepository.save(sprint);
  }

  async assignMembers(
    sprint: Sprint,
    taskId: string,
    userIds: string[],
  ): Promise<Task> {
    const task = await this.taskService.getTask(taskId);
    const commingUser = await this.userService.getUsers(userIds);
    const commingUID = sprint.members.map((member) => member.id);
    const memberUID = task.members.map((member) => member.id);
    commingUID.forEach((id) => {
        if (!memberUID.includes(id)) {
            throw new UnauthorizedException(`User ID: ${id} not in sprint`);
        }
    })
    return this.taskService.addMembers(task, commingUser);
  }

  async unassignMembers(
    sprint: Sprint,
    taskId: string,
    userIds: string[],
  ): Promise<Task> {
    const task = await this.taskService.getTask(taskId);
    const commingUser = await this.userService.getUsers(userIds);
    const commingUID = sprint.members.map((member) => member.id);
    const memberUID = task.members.map((member) => member.id);
    commingUID.forEach((id) => {
        if (!memberUID.includes(id)) {
            throw new UnauthorizedException(`User ID: ${id} not in sprint`);
        }
    })
    return this.taskService.removeMembers(task, commingUser);
  }

}
