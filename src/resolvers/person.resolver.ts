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
import { ValidationError } from 'apollo-server-errors';
import { PersonAlias } from '../models/personAlias.model';
import { GraphDBService } from '../graphDB.service';

@Resolver(() => Person)
export class PersonResolver {
  constructor(private prisma: PrismaService, private graphDB: GraphDBService) {}

  @Query(() => [Person])
  async persons(
    @Args({ name: 'nameForSearch', nullable: true, type: () => String })
    nameForSearch: string,
  ): Promise<Person[]> {
    // let option = {};
    // if (nameForSearch != null) {
    //   option = {
    //     ...option,
    //     where: {
    //       OR: [
    //         {
    //           name: {
    //             contains: nameForSearch,
    //           },
    //         },
    //         {
    //           personAliases: {
    //             some: {
    //               alias: {
    //                 contains: nameForSearch,
    //               },
    //             },
    //           },
    //         },
    //       ],
    //     },
    //   };
    // }
    // return this.prisma.person.findMany(option);
    return this.graphDB.getPersons(nameForSearch);
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
    return this.prisma.personRelation.findMany({
      where: {
        personRelationPersons: {
          some: {
            personId: person.id,
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
    return this.prisma.activity.findMany({
      where: {
        activityPersons: {
          some: {
            personId: person.id,
          },
        },
      },
      include: {
        activityPersons: true,
        source: true,
      },
    });
  }

  @ResolveField(() => [PersonAlias])
  async aliases(@Parent() person: Person) {
    return this.prisma.personAlias.findMany({
      where: {
        personId: person.id,
      },
    });
  }

  @Mutation(() => Person)
  async createPerson(
    @Args({ name: 'name' }) name: string,
    @Args({ name: 'description' }) description: string,
  ) {
    if (name == '') {
      throw new ValidationError('名前を入力してください');
    }
    // return this.prisma.person.create({
    //   data: {
    //     name: name,
    //     description: description,
    //   },
    // });
    return this.graphDB.createPerson(name, description);
  }

  @Mutation(() => Person)
  async updatePerson(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'name' }) name: string,
    @Args({ name: 'description' }) description: string,
  ) {
    if (name == '') {
      throw new ValidationError('名前を入力してください');
    }

    return this.prisma.person.update({
      where: {
        id: id,
      },
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
          personId: id,
        },
      }),
      this.prisma.personRelationPerson.deleteMany({
        where: {
          personId: id,
        },
      }),
      this.prisma.personAlias.deleteMany({
        where: {
          personId: id,
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
