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

@Resolver(() => PersonRelation)
export class PersonRelationResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => PersonRelation)
  async personRelation(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PersonRelation> {
    return this.prisma.personRelation.findUnique({
      where: {
        id: id,
      },
    });
  }

  @ResolveField(() => [Person])
  async persons(@Parent() personRelation: PersonRelation) {
    const personRelationPersons = await this.prisma.personRelationPerson.findMany(
      {
        where: {
          person_relation: personRelation,
        },
        include: {
          person: true,
        },
      },
    );
    return personRelationPersons.map(
      (personRelationPerson) => personRelationPerson.person,
    );
  }
}
