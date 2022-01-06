import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Source } from '../models/source.model';
import { Person } from '../models/person.model';

@Resolver(() => Source)
export class SourceResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Source)
  async source(@Args('id', { type: () => Int }) id: number): Promise<Source> {
    return this.prisma.source.findUnique({
      where: {
        id: id,
      },
    });
  }

  @Query(() => [Source])
  async sources(
    @Args({ name: 'nameForSearch', nullable: true, type: () => String })
    nameForSearch: string,
  ): Promise<Source[]> {
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
    return this.prisma.source.findMany(option);
  }

  @Mutation(() => Source)
  async createSource(@Args({ name: 'name' }) name: string) {
    return this.prisma.source.create({
      data: {
        name: name,
      },
    });
  }

  @Mutation(() => Source)
  async updateSource(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'name' }) name: string,
  ) {
    return this.prisma.source.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
  }

  @Mutation(() => Source)
  async deleteSource(@Args({ name: 'id', type: () => Int }) id: number) {
    return this.prisma.source.delete({
      where: {
        id: id,
      },
    });
  }
}
