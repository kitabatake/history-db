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
  async relationsFrom(@Parent() person: Person) {
    return await this.prisma.personRelation.findMany({
      where: {
        from_id: person.id,
      },
      include: {
        to: true,
        from: true,
      },
    });
  }

  @ResolveField(() => [PersonRelation])
  async relationsTo(@Parent() person: Person) {
    return await this.prisma.personRelation.findMany({
      where: {
        to_id: person.id,
      },
      include: {
        to: true,
        from: true,
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

  @Mutation(() => PersonRelation)
  async createRelation(
    @Args({ name: 'from_person_id', type: () => Int }) from_person_id: number,
    @Args({ name: 'to_person_id', type: () => Int }) to_person_id: number,
    @Args({ name: 'description' }) description: string,
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
