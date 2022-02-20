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
import { GraphDBService } from '../graphDB.service';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private prisma: PrismaService, private graphDB: GraphDBService) {}

  // @Query(() => Activity)
  // async activity(
  //   @Args('id', { type: () => Int }) id: number,
  // ): Promise<Activity> {
  //   return this.prisma.activity.findUnique({
  //     where: {
  //       id: id,
  //     },
  //     include: {
  //       source: true,
  //     },
  //   });
  // }
  //
  // @Query(() => [Activity])
  // async activities(): Promise<Activity[]> {
  //   return this.prisma.activity.findMany({
  //     orderBy: [{ year: 'asc' }, { month: 'asc' }, { day: 'asc' }],
  //   });
  // }

  @Mutation(() => Activity)
  async createActivity(
    @Args({ name: 'name' }) name: string,
    @Args({ name: 'description', nullable: true }) description?: string,
  ) {
    return this.graphDB.createActivity(name, description);
  }

  @Mutation(() => Activity)
  async updateActivity(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'personIds', nullable: true, type: () => [Int!] })
    personIds: number[],
    @Args({ name: 'description' }) description: string,
    @Args({ name: 'year', nullable: true, type: () => Int }) year?: number,
    @Args({ name: 'month', nullable: true, type: () => Int }) month?: number,
    @Args({ name: 'day', nullable: true, type: () => Int }) day?: number,
    @Args({ name: 'sourceId', nullable: true, type: () => Int })
    sourceId?: number,
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
          year: year,
          month: month,
          day: day,
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

  @Mutation(() => Int)
  async deleteActivity(@Args({ name: 'id', type: () => Int }) id: number) {
    await this.graphDB.deleteActivity(id);
    return id;
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
