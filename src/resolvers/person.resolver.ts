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
import { Activity } from '../models/activity.model';

@Resolver(() => Person)
export class PersonResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Person])
  async persons(
    @Args({ name: 'nameForSearch', nullable: true, type: () => String })
    nameForSearch: string,
  ): Promise<Person[]> {
    let option = {};
    if (nameForSearch != null) {
      option = {
        ...option,
        where: {
          name: {
            contains: nameForSearch,
          },
        },
      };
    }
    return this.prisma.person.findMany(option);
  }

  @Query(() => Person)
  async person(@Args('id', { type: () => Int }) id: number): Promise<Person> {
    return this.prisma.person.findUnique({
      where: {
        id: id,
      },
    });
  }

  @ResolveField(() => [PersonRelation])
  async relations(@Parent() person: Person) {
    return await this.prisma.personRelation.findMany({
      where: {
        personRelationPersons: {
          some: {
            person_id: person.id,
          },
        },
      },
      include: {
        personRelationPersons: true,
      },
    });
  }

  @ResolveField(() => [Activity])
  async activities(@Parent() person: Person) {
    return await this.prisma.activity.findMany({
      where: {
        activityPersons: {
          some: {
            person_id: person.id,
          },
        },
      },
      include: {
        activityPersons: true,
        source: true,
      },
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

  @Mutation(() => Person)
  async deletePerson(@Args({ name: 'id', type: () => Int }) id: number) {
    const [, , person] = await this.prisma.$transaction([
      this.prisma.activityPerson.deleteMany({
        where: {
          person_id: id,
        },
      }),
      this.prisma.personRelationPerson.deleteMany({
        where: {
          person_id: id,
        },
      }),
      this.prisma.person.delete({
        where: {
          id: id,
        },
      }),
    ]);
    return person;
  }
}
