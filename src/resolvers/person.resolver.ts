import { Resolver, Query } from '@nestjs/graphql';
import { Person } from '../models/person.model';
import { PrismaService } from '../prisma.service';

@Resolver((of) => Person)
export class PersonResolver {
  constructor(private prisma: PrismaService) {}

  @Query((returns) => [Person])
  async persons() {
    return this.prisma.person.findMany();
  }
}
