import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { PersonRelation } from '../models/personRelation.model';
import { PrismaService } from '../prisma.service';

@Resolver(() => PersonRelation)
export class PersonAliasResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => PersonRelation)
  async createPersonAlias(
    @Args({ name: 'personId', type: () => Int! }) personId: number,
    @Args({ name: 'alias' }) alias: string,
  ) {
    return this.prisma.personAlias.create({
      data: {
        personId: personId,
        alias: alias,
      },
    });
  }
}
