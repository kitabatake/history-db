import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Activity } from '../models/activity.model';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => Activity)
  async createActivity(
    @Args({ name: 'person_ids', type: () => [Int] }) person_ids: number[],
    @Args({ name: 'description' }) description: string,
  ) {
    return await this.prisma.activity.create({
      data: {
        description: description,
        activityPersons: {
          create: person_ids.map((id) => {
            return {
              person_id: id,
            };
          }),
        },
      },
      include: {
        activityPersons: true,
      },
    });
  }
}
