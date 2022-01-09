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
    @Args({ name: 'person_ids', nullable: true, type: () => [Int] })
    person_ids: number[],
    @Args({ name: 'description' }) description: string,
    @Args({ name: 'source_id', nullable: true, type: () => Int })
    source_id: number | null,
  ) {
    return await this.prisma.activity.create({
      data: {
        description: description,
        source_id: source_id,
        activityPersons: {
          create: person_ids.map((id) => {
            return {
              person_id: id,
            };
          }),
        },
      },
    });
  }

  @Mutation(() => Activity)
  async updateActivity(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'person_ids', nullable: true, type: () => [Int!] })
    person_ids: number[],
    @Args({ name: 'description' }) description: string,
    @Args({ name: 'source_id', nullable: true, type: () => Int })
    source_id: number | null,
  ) {
    const [, personRelation] = await this.prisma.$transaction([
      this.prisma.activityPerson.deleteMany({
        where: {
          activity_id: id,
        },
      }),
      this.prisma.activity.update({
        where: {
          id: id,
        },
        data: {
          description: description,
          source_id: source_id,
          activityPersons: {
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

  @Mutation(() => Activity)
  async deleteActivity(@Args({ name: 'id', type: () => Int }) id: number) {
    const [, activity] = await this.prisma.$transaction([
      this.prisma.activityPerson.deleteMany({
        where: {
          activity_id: id,
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
        activity_id: activity.id,
      },
      include: {
        person: true,
      },
    });
    return activityPersons.map((activityPerson) => activityPerson.person);
  }
}
