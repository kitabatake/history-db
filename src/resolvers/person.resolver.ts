import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  Int,
  Field,
} from '@nestjs/graphql';
import { Person } from '../models/person.model';
import { PersonService } from '../person.service';
import { PersonRelation } from '../models/personRelation.model';
import { PrismaService } from '../prisma.service';

@Resolver((of) => Person)
export class PersonResolver {
  constructor(
    private personService: PersonService,
    private prisma: PrismaService,
  ) {}

  @Query((returns) => [Person])
  async persons() {
    return this.personService.persons({});
  }

  @Query((returns) => Person)
  async person(@Args('id', { type: () => Int }) id: number) {
    return this.personService.findById(id);
  }

  // @Field((returns) => [PersonRelation])
  // async relationsFrom(@Parent() person: Person) {
  //   return person.relationsFrom;
  // }

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
    @Parent() from: Person,
  ) {
    await this.prisma.person.update({
      where: {
        id: from_person_id,
      },
      data: {
        fromRelations: {
          create: {
            description: description,
            to_id: to_person_id,
          },
        },
      },
    });
  }
}
