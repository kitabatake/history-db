import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { PersonResolver } from './resolvers/person.resolver';
import { PersonService } from './person.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: process.cwd() + 'src/schema.gql',
      debug: true,
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, PersonResolver, PersonService],
})
export class AppModule {}
