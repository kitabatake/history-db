import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Person } from '../models/person.model';
import { CreatePersonArgs } from '../gql_args/create_person.args';
import { PersonService } from '../person.service';

@Resolver()
// @Resolver((of) => Person)
export class PersonResolver {
  constructor(private personService: PersonService) {}

  @Query((returns) => [Person])
  async persons() {
    return this.personService.persons({});
  }

  @Mutation((returns) => Person)
  async createPerson(@Args() createPersonArgs: CreatePersonArgs) {
    const { name, description } = createPersonArgs;
    return this.personService.createPerson({
      name: name,
      description: description,
    });
  }
}
