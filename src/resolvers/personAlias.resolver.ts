import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { PersonAlias } from '../models/personAlias.model';
import { Person } from '../models/person.model';

@Resolver(() => PersonAlias)
export class PersonAliasResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [PersonAlias])
  async personAliases(
    @Args({ name: 'personId', type: () => Int! }) personId: number,
  ) {
    return this.prisma.personAlias.findMany({
      where: {
        personId: personId,
      },
    });
  }

  @Mutation(() => PersonAlias)
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

  @Mutation(() => PersonAlias)
  async deletePersonAlias(@Args({ name: 'id', type: () => Int }) id: number) {
    return this.prisma.personAlias.delete({
      where: {
        id: id,
      },
    });
  }
}
