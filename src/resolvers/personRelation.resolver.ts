import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Person } from '../models/person.model';
import { PersonRelation } from '../models/personRelation.model';
import { PrismaService } from '../prisma.service';
import { Activity } from '../models/activity.model';
import { Source } from '../models/source.model';

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

  @Mutation(() => PersonRelation)
  async updatePersonRelation(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'person_ids', nullable: true, type: () => [Int!] })
    person_ids: number[],
    @Args({ name: 'description' }) description: string,
  ) {
    const [, personRelation] = await this.prisma.$transaction([
      this.prisma.personRelationPerson.deleteMany({
        where: {
          person_relation_id: id,
        },
      }),
      this.prisma.personRelation.update({
        where: {
          id: id,
        },
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
      }),
    ]);

    return personRelation;
  }

  @Mutation(() => PersonRelation)
  async deletePersonRelation(
    @Args({ name: 'id', type: () => Int }) id: number,
  ) {
    const [, personRelation] = await this.prisma.$transaction([
      this.prisma.personRelationPerson.deleteMany({
        where: {
          person_relation_id: id,
        },
      }),
      this.prisma.personRelation.delete({
        where: {
          id: id,
        },
      }),
    ]);
    return personRelation;
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
