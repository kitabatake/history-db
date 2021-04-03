import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { PersonService } from './person.service';
import { PrismaService } from './prisma.service';
import { PersonResolver } from './resolvers/person.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: process.cwd() + 'src/schema.gql',
      debug: true,
      playground: true,
    }),
  ],
  controllers: [AppController],
  providers: [PrismaService, PersonService, PersonResolver],
})
export class AppModule {}
