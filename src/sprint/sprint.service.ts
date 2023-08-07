import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Sprint } from './sprint.entity';
import { DeleteResult, FindOneOptions, Repository } from 'typeorm';
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
    adminId: string,
  ): Promise<Sprint> {
    const admin = await this.userService.getUser(adminId);
    console.log('Admin: ', admin);
    const members: User[] = [admin];
    const sprint = this.sprintRepository.create({
      name,
      description,
      admin: admin,
      members,
    });
    return this.sprintRepository.save(sprint);
  }

  sprintRelationOptions: FindOneOptions<Sprint> = {
    relations: {
      admin: true,
      members: true,
      tasks: {
        priority: true,
        members: true,
      }
    },
  };

  async getSprint(id: string): Promise<Sprint> {
    const sprint = await this.sprintRepository.findOne({
      where: { id },
      ...this.sprintRelationOptions,
    });
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
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
    status: string,
    priority: Priority,
    expireDate: Date,
  ): Promise<Task> {
    const task = await this.taskService.createTask(
      name,
      description,
      status,
      sprint,
      priority,
      expireDate,
    );
    sprint.tasks = [...sprint.tasks, task];
    await this.sprintRepository.save(sprint);
    return task
  }

  async removeTask(sprint: Sprint, taskId: string): Promise<String> {
    sprint.tasks = sprint.tasks.filter((task) => task.id !== taskId);
    const res = await this.taskService.deleteTask(taskId);
    await this.sprintRepository.save(sprint);
    return `Deleted ${res.affected} task(s)`;
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
    });
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
    });
    return this.taskService.removeMembers(task, commingUser);
  }

  async deleteSprint(sprint: Sprint): Promise<string> {
    let log = "";
    const pros: Promise<DeleteResult>[] = [];
    sprint.tasks.forEach(async (task) => {
      pros.push(this.taskService.deleteTask(task.id));
    });
    const taskres = await Promise.all(pros);
    taskres.forEach((r) => {
        log += `Deleted ${r.affected} task(s)`;
    });
    const sprintRes: DeleteResult = await this.sprintRepository.delete(sprint.id);
    log += `Deleted ${sprintRes.affected} sprint(s)`;
    return log;
  }

  async filterAndSortTasks(sprint: Sprint, priority: string, status: string, sortBy: string, asc: boolean): Promise<Task[]> {
    const filterdTasks = await this.taskService.filterTasks(sprint, priority, status);
    if (sortBy === null || sortBy === undefined) return filterdTasks;
    return this.taskService.sortTasks(filterdTasks, sortBy, asc);
  }
}
