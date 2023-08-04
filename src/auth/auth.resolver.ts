import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { LoginResult } from './auth.entity';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Mutation((returns) => User)
    async registerUser(
        @Args ('username') username: string,
        @Args ('password') password: string,
        @Args ('email') email: string,
        @Args ('displayName') displayName: string,
    ) {
        return this.authService.registerUser(username, password, email, displayName);
    }

    @Query((returns) => LoginResult)
    async logIn(
        @Args ('usernameOrEmail') usernameOrEmail: string,
        @Args ('password') password: string,
    ) {
        const [user, token] = await this.authService.LogIn(usernameOrEmail, password);
        const loginResult = new LoginResult();
        loginResult.user = user;
        loginResult.token = token;
        return loginResult;
    }
}
