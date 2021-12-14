import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Source } from '../models/source.model';

@Resolver(() => Source)
export class SourceResolver {
  constructor(private prisma: PrismaService) {}

  @Mutation(() => Source)
  async createSource(@Args({ name: 'name' }) name: string) {
    return this.prisma.source.create({
      data: {
        name: name,
      },
    });
  }
}
