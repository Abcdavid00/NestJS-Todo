import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Priority } from './priority.entity';
import { PriorityService } from './priority.service';

@Resolver((of) => Priority)
export class PriorityResolver {
  constructor(private priorityService: PriorityService) {}

  @Query((returns) => [Priority])
  getAllPriorities() {
    return this.priorityService.findAll();
  }

  @Query((returns) => Priority)
  getPriorityById(
    @Args('id') id: string,) {
    return this.priorityService.findOneById(id);
  }

  @Mutation((returns) => Priority)
  createPriority(@Args('name') name: string) {
    return this.priorityService.create(name);
  }
}
