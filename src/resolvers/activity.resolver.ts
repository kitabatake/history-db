import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Activity } from '../models/activity.model';
import { Person } from '../models/person.model';
import { Source } from '../models/source.model';
import { PersonRelation } from '../models/personRelation.model';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Activity)
  async activity(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Activity> {
    return this.prisma.activity.findUnique({
      where: {
        id: id,
      },
      include: {
        source: true,
      },
    });
  }

  @Query(() => [Activity])
  async activities(): Promise<Activity[]> {
    return this.prisma.activity.findMany();
  }

  @Mutation(() => Activity)
  async createActivity(
    @Args({ name: 'personIds', nullable: true, type: () => [Int] })
    personIds: number[],
    @Args({ name: 'description' }) description: string,
    @Args({ name: 'sourceId', nullable: true, type: () => Int })
    sourceId: number | null,
  ) {
    return await this.prisma.activity.create({
      data: {
        description: description,
        sourceId: sourceId,
        activityPersons: {
          create: personIds.map((id) => {
            return {
              personId: id,
            };
          }),
        },
      },
    });
  }

  @Mutation(() => Activity)
  async updateActivity(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'personIds', nullable: true, type: () => [Int!] })
    personIds: number[],
    @Args({ name: 'description' }) description: string,
    @Args({ name: 'sourceId', nullable: true, type: () => Int })
    sourceId: number | null,
  ) {
    const [, personRelation] = await this.prisma.$transaction([
      this.prisma.activityPerson.deleteMany({
        where: {
          activityId: id,
        },
      }),
      this.prisma.activity.update({
        where: {
          id: id,
        },
        data: {
          description: description,
          sourceId: sourceId,
          activityPersons: {
            create: personIds.map((id) => {
              return {
                personId: id,
              };
            }),
          },
        },
      }),
    ]);

    return personRelation;
  }

  @Mutation(() => Activity)
  async deleteActivity(@Args({ name: 'id', type: () => Int }) id: number) {
    const [, activity] = await this.prisma.$transaction([
      this.prisma.activityPerson.deleteMany({
        where: {
          activityId: id,
        },
      }),
      this.prisma.activity.delete({
        where: {
          id: id,
        },
      }),
    ]);
    return activity;
  }

  @ResolveField(() => [Person])
  async persons(@Parent() activity: Activity) {
    const activityPersons = await this.prisma.activityPerson.findMany({
      where: {
        activityId: activity.id,
      },
      include: {
        person: true,
      },
    });
    return activityPersons.map((activityPerson) => activityPerson.person);
  }
}
