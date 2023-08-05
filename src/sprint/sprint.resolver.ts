import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { SprintService } from './sprint.service';
import { Sprint } from './sprint.entity';
import { UseGuards } from '@nestjs/common';
import { GqlUser } from 'src/user/user.decorator';
import { AuthGuard } from 'src/vendors/guards/auth.guard';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver()
export class SprintResolver {
    constructor(
        private readonly sprintService: SprintService,
        private readonly userService: UserService,
    ) {}

    @UseGuards(AuthGuard)
    @Mutation(() => Sprint)
    async createSprintVIA_TOKEN(@GqlUser() user: User, @Args('description') description: string) {
        return this.sprintService.createSprint(description, user)
    }

    @Mutation(() => Sprint)
    async createSprintVIA_UID(@Args('description') description: string, @Args('uid') uid: string) {
        const user = await this.userService.getUser(uid)
        return this.sprintService.createSprint(description, user)
    }

    @Query(() => Sprint)
    async getSprint(@Args('id') id: string) {
        return this.sprintService.getSprint(id)
    }
}
