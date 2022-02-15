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
import { PrismaService } from '../prisma.service';
import { Activity } from '../models/activity.model';
import { ValidationError } from 'apollo-server-errors';
import { GraphDBService } from '../graphDB.service';
import { RelatedPerson } from '../models/relatedPerson.model';
import { RelationshipDirection } from '../RelationshipDirection';

@Resolver(() => Person)
export class PersonResolver {
  constructor(private prisma: PrismaService, private graphDB: GraphDBService) {}

  @Query(() => [Person])
  async persons(
    @Args({ name: 'nameForSearch', nullable: true, type: () => String })
    nameForSearch: string,
  ): Promise<Person[]> {
    return this.graphDB.getPersons(nameForSearch);
  }

  @Query(() => Person)
  async person(@Args('id', { type: () => Int }) id: number): Promise<Person> {
    return this.graphDB.getPerson(id);
  }

  @ResolveField(() => [RelatedPerson])
  async relatedPersons(@Parent() person: Person) {
    return this.graphDB.getRelatedPersons(person.id);
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

  @Mutation(() => Person)
  async createPerson(
    @Args({ name: 'name' }) name: string,
    @Args({ name: 'description' }) description: string,
  ) {
    if (name == '') {
      throw new ValidationError('名前を入力してください');
    }
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
    return this.graphDB.updatePerson(id, name, description);
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

  @Mutation(() => Person)
  async addPersonAlias(
    @Args({ name: 'personId', type: () => Int, nullable: false })
    personId: number,
    @Args({ name: 'alias' }) alias: string,
  ) {
    return await this.graphDB.addPersonAlias(personId, alias);
  }

  @Mutation(() => Person)
  async removePersonAlias(
    @Args({ name: 'personId', type: () => Int }) personId: number,
    @Args({ name: 'alias' }) alias: string,
  ) {
    return await this.graphDB.removePersonAlias(personId, alias);
  }

  @Mutation(() => Person)
  async addRelatedPerson(
    @Args({ name: 'fromId', type: () => Int, nullable: false }) fromId: number,
    @Args({ name: 'toId', type: () => Int, nullable: false }) toId: number,
    @Args({ name: 'label' }) label: string,
  ) {
    return await this.graphDB.addPersonRelationship(fromId, toId, label);
  }

  @Mutation(() => Int)
  async removeRelatedPerson(
    @Args({ name: 'id', type: () => Int, nullable: false }) id: number,
  ) {
    await this.graphDB.removePersonRelationship(id);
    return id;
  }
}
