import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';


@Resolver()
export class UserResolver {
    constructor(
        private userService: UserService,
    ) {}

    @Query((returns) => User)
    async getUser(
        @Args ('id') id: string,
    ) {
        return this.userService.getUser(id);
    }

    @Query((returns) => [User])
    async findUserByUsername(
        @Args ('username') username: string,
    ) {
        return this.userService.findByUsername(username);
    }

    
}
