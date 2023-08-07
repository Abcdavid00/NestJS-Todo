import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SprintService } from './sprint.service';
import { Sprint } from './sprint.entity';
import { MethodNotAllowedException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { GqlUser } from 'src/user/user.decorator';
import { AuthGuard } from 'src/vendors/guards/auth.guard';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { PriorityService } from '../priority/priority.service';
import { Task } from 'src/task/task.entity';

@Resolver()
export class SprintResolver {
    constructor(
        private readonly priorityService: PriorityService,
        private readonly sprintService: SprintService,
        private readonly userService: UserService,
    ) {}

    @UseGuards(AuthGuard)
    @Mutation(() => Sprint)
    async createSprint(
        @GqlUser() user: User,
        @Args('name') name: string,
        @Args('description') description: string
    ) {
        // console.log("Create Sprint User: ", user)
        const sprint = await this.sprintService.createSprint(name, description, user)
        // console.log("Sprint: ", sprint)
        return sprint
        // return this.sprintService.createSprint(description, user)
    }

    @Query(() => Sprint)
    async getSprint(@Args('id') id: string) {
        return this.sprintService.getSprint(id)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Sprint)
    async addMembers(
        @GqlUser() user: User,
        @Args('sprintId') sprintId: string,
        @Args('memberIds', { type: () => [String] }) memberIds: string[]
    ) {
        const sprint = await this.sprintService.getSprint(sprintId)
        if (sprint.admin.id !== user["sub"]) {
            throw new UnauthorizedException("You are not the admin of this sprint")
        }
        const members = await this.userService.getUsers(memberIds)
        return this.sprintService.addMembers(sprint, members)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Sprint)
    async removeMembers(
        @GqlUser() user: User,
        @Args('sprintId') sprintId: string,
        @Args('memberIds', { type: () => [String] }) memberIds: string[]
    ) {
        const sprint = await this.sprintService.getSprint(sprintId)
        if (sprint.admin.id !== user["sub"]) {
            throw new UnauthorizedException("You are not the admin of this sprint")
        }
        if (memberIds.includes(sprint.admin.id)) {
            throw new MethodNotAllowedException("You cannot remove yourself from the sprint")
        }
        const members = await this.userService.getUsers(memberIds)
        return this.sprintService.removeMembers(sprint, members)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Sprint)
    async modifySprint(
        @GqlUser() user: User,
        @Args('sprintId') sprintId: string,
        @Args('name') name: string,
        @Args('description') description: string
    ) {
        const sprint = await this.sprintService.getSprint(sprintId)
        console.log(`Sprint Admin: ${sprint.admin.id} User: `)
        if (sprint.admin.id !== user["sub"]) {
            throw new UnauthorizedException("You are not the admin of this sprint")
        }
        return this.sprintService.modifySprint(sprint, name, description)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Sprint)
    async addTask(
        @GqlUser() user: User,
        @Args('sprintId') sprintId: string,
        @Args('name') name: string,
        @Args('description') description: string,
        @Args('priorityId') priorityId: string,
        @Args('expireDate') expireDate: Date
    ) {
        const sprint = await this.sprintService.getSprint(sprintId)
        if (sprint.admin.id !== user["sub"]) {
            throw new UnauthorizedException("You are not the admin of this sprint")
        }
        const priority = await this.priorityService.getPriority(priorityId)
        console.log("Priority: ", priority.name)
        return this.sprintService.addTask(sprint, name, description, priority, expireDate)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Sprint)
    async removeTask(
        @GqlUser() user: User,
        @Args('sprintId') sprintId: string,
        @Args('taskId') taskId: string
    ) {
        const sprint = await this.sprintService.getSprint(sprintId)
        if (sprint.admin.id !== user["sub"]) {
            throw new UnauthorizedException("You are not the admin of this sprint")
        }
        return this.sprintService.removeTask(sprint, taskId)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Task)
    async assignMembersToTask(
        @GqlUser() user: User,
        @Args('sprintId') sprintId: string,
        @Args('taskId') taskId: string,
        @Args('memberIds', { type: () => [String] }) memberIds: string[]
    ) {
        const sprint = await this.sprintService.getSprint(sprintId)
        if (sprint.admin.id !== user["sub"]) {
            throw new UnauthorizedException("You are not the admin of this sprint")
        }
        return this.sprintService.assignMembers(sprint, taskId, memberIds)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Task)
    async unassignMembersFromTask(
        @GqlUser() user: User,
        @Args('sprintId') sprintId: string,
        @Args('taskId') taskId: string,
        @Args('memberIds', { type: () => [String] }) memberIds: string[]
    ) {
        const sprint = await this.sprintService.getSprint(sprintId)
        if (sprint.admin.id !== user["sub"]) {
            throw new UnauthorizedException("You are not the admin of this sprint")
        }
        return this.sprintService.unassignMembers(sprint, taskId, memberIds)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => String)
    async deleteSprint(
        @GqlUser() user: User,
        @Args('sprintId') sprintId: string
    ) {
        const sprint = await this.sprintService.getSprint(sprintId)
        if (sprint.admin.id !== user["sub"]) {
            throw new UnauthorizedException("You are not the admin of this sprint")
        }
        return this.sprintService.deleteSprint(sprint)
    }
}
