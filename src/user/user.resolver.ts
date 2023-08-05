import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/vendors/guards/auth.guard';
import { GqlUser } from './user.decorator';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  async getUser(@Args('id') id: string) {
    return this.userService.getUser(id);
  }

  @Query((returns) => User)
  async findUserByUsername(@Args('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Query((returns) => User)
  async findUserByEmail(@Args('email') email: string) {
    return this.userService.findByEmail(email);
  }

//   @UseGuards(AuthGuard)
  @Mutation((returns) => User)
  async updateUserInfo(
    @GqlUser() user: User,
    @Args('displayName') displayName: string,
    @Args('phone') phone: string,
  ) {
    const Pros: Promise<User>[] = [
        this.userService.updateDisplayName(user.id, displayName),
        this.userService.updatePhone(user.id, phone),
    ]
    await Promise.all(Pros);
    return this.userService.getUser(user.id);
  }
}
