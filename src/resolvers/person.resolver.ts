import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  Int,
  ResolveField,
} from '@nestjs/graphql';
import { Person } from '../models/person.model';
import { PersonRelation } from '../models/personRelation.model';
import { PrismaService } from '../prisma.service';
import { PersonService } from '../person.service';

@Resolver(() => Person)
export class PersonResolver {
  constructor(
    private prisma: PrismaService,
    private personService: PersonService,
  ) {}

  @Query(() => [Person])
  async persons(): Promise<Person[]> {
    return this.personService.findPersons();
  }

  @Query(() => Person)
  async person(@Args('id', { type: () => Int }) id: number): Promise<Person> {
    return this.personService.findPersonById(id);
  }

  @ResolveField(() => [PersonRelation])
  async relations(@Parent() person: Person) {
    const relations = await this.prisma.personRelation.findMany({
      where: {
        persons: {
          some: {
            person_id: person.id,
          },
        },
      },
      include: {
        persons: true,
      },
    });

    return relations.map((relation) => {
      return {
        ...relation,
        persons: relation.persons.map((person) => {
          return this.prisma.person.findUnique({
            where: {
              id: person.id,
            },
          });
        }),
      };
    });
  }

  @Mutation(() => Person)
  async createPerson(
    @Args({ name: 'name' }) name: string,
    @Args({ name: 'description' }) description: string,
  ) {
    return await this.personService.createPerson(name, description);
  }

  @Mutation(() => PersonRelation)
  async createRelation(
    @Args({ name: 'person_ids', type: () => [Int] }) person_ids: number[],
    @Args({ name: 'description' }) description: string,
  ) {
    return await this.personService.createRelation(person_ids, description);
  }
}
