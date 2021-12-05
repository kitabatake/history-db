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

@Resolver(() => Person)
export class PersonResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Person])
  async persons() {
    return this.prisma.person.findMany();
  }

  @Query(() => Person)
  async person(@Args('id', { type: () => Int }) id: number) {
    return this.prisma.person.findUnique({
      where: {
        id: id,
      },
    });
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
    return this.prisma.person.create({
      data: {
        name: name,
        description: description,
      },
    });
  }

  @Mutation(() => PersonRelation)
  async createRelation(
    @Args({ name: 'person_ids', type: () => [Int] }) person_ids: number[],
    @Args({ name: 'description' }) description: string,
  ) {
    return this.prisma.personRelation.create({
      data: {
        description: description,
        persons: {
          create: person_ids.map((id) => {
            return {
              person_id: id,
            };
          }),
        },
      },
    });
  }
}
