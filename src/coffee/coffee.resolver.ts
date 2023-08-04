import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Coffee } from './coffee.entity';
import { CoffeeService } from './coffee.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GqlUser } from 'src/user/user.decorator';

@Resolver((of) => Coffee)
export class CoffeeResolver {
  constructor(private coffeeService: CoffeeService) {}

  @Query((returns) => (Coffee || undefined))
  getCoffee(@Args('id') id: string) {
    return this.coffeeService.findOneById(id);
  }

  @Mutation((returns) => Coffee)
  createCoffee(
    @Args('name') name: string,
    @Args('sPrice') sPrice: number,
    @Args('mPrice') mPrice: number,
    @Args('lPrice') lPrice: number,
    @Args('description') description: string,

  ) {
    return this.coffeeService.create(name, sPrice, mPrice, lPrice, description);
  }

  @Query((returns) => [Coffee])
  @UseGuards(AuthGuard)
  getAllCoffees(
    @GqlUser() user
  ) {
    console.log("All coffees log user: ", user)
    return this.coffeeService.findAll();
  }
}
