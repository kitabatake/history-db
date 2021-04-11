import { Resolver, Query, Mutation, Args, Parent, Int } from '@nestjs/graphql';
import { Person } from '../models/person.model';
import { PersonService } from '../person.service';
import { PersonRelation } from '../models/personRelation.model';

@Resolver((of) => Person)
export class PersonResolver {
  constructor(private personService: PersonService) {}

  @Query((returns) => [Person])
  async persons() {
    return this.personService.persons({});
  }

  @Query((returns) => Person)
  async person(@Args('id', { type: () => Int }) id: number) {
    return this.personService.findById(id);
  }

  @Mutation((returns) => Person)
  async createPerson(
    @Args({ name: 'name' }) name: string,
    @Args({ name: 'description' }) description: string,
  ) {
    return this.personService.createPerson({
      name: name,
      description: description,
    });
  }

  @Mutation((returns) => PersonRelation)
  async createRelation(
    @Args({ name: 'from_person_id', type: () => Int }) from_person_id: number,
    @Args({ name: 'to_person_id', type: () => Int }) to_person_id: number,
    @Args({ name: 'description' }) description: string,
  ) {
    return this.personService.createPersonRelation({
      from: from_person_id,
      to: to_person_id,
      description: description,
    });
  }
}
