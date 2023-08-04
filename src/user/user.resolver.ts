import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';


@Resolver()
export class UserResolver {
    constructor(
        private userService: UserService,
    ) {}

    // @Mutation((returns) => User)
    // async registerUser(
    //     @Args ('username') username: string,
    //     @Args ('password') password: string,
    //     @Args ('email') email: string,
    //     @Args ('displayName') displayName: string,
    // ) {
    //     const [user, errorCode] = await this.userService.registerUser(username, password, email, displayName);
    //     console.log(user, errorCode)
    //     return user;
    // }


    @Query((returns) => User)
    async getUser(
        @Args ('id') id: string,
    ) {
        return this.userService.getUser(id);
    }

    // @Query((returns) => User)
    // async login(
    //     @Args ('usernameOrEmail') usernameOrEmail: string,
    //     @Args ('password') password: string,
    // ) {
    //     const [user, errorCode] = await this.userService.login(usernameOrEmail, password);
    //     return user;
    // }
}
