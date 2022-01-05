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

  @Query(() => [PersonRelation])
  async personRelations(): Promise<Activity[]> {
    return this.prisma.personRelation.findMany();
  }

  @Mutation(() => PersonRelation)
  async createPersonRelation(
    @Args({ name: 'person_ids', nullable: true, type: () => [Int!] })
    person_ids: number[],
    @Args({ name: 'description' }) description: string,
  ) {
    return await this.prisma.personRelation.create({
      data: {
        description: description,
        personRelationPersons: {
          create: person_ids.map((id) => {
            return {
              person_id: id,
            };
          }),
        },
      },
    });
  }

  @ResolveField(() => [Person])
  async persons(@Parent() personRelation: PersonRelation) {
    const personRelationPersons = await this.prisma.personRelationPerson.findMany(
      {
        where: {
          person_relation_id: personRelation.id,
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
