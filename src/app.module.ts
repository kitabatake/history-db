import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { PersonResolver } from './resolvers/person.resolver';
import { PersonRelationResolver } from './resolvers/personRelation.resolver';
import { SourceResolver } from './resolvers/source.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: process.cwd() + 'src/schema.gql',
      debug: true,
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    PersonResolver,
    PersonRelationResolver,
    SourceResolver,
  ],
})
export class AppModule {}
