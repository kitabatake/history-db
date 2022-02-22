import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Person } from '../models/person.model';
import { PrismaService } from '../prisma.service';
import { GraphDBService } from '../graphDB.service';
import { Elements } from '../models/graph/elements.model';

@Resolver()
export class GraphResolver {
  constructor(private graphDB: GraphDBService) {}

  @Query(() => Elements)
  async graph(
    @Args('targetNodeId', { type: () => Int }) targetNodeId: number,
  ): Promise<Elements> {
    return this.graphDB.getElements(targetNodeId);
  }
}
