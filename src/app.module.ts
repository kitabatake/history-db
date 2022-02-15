import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { PersonResolver } from './resolvers/person.resolver';
import { SourceResolver } from './resolvers/source.resolver';
import { ActivityResolver } from './resolvers/activity.resolver';
import { AppLoggerMiddleware } from './middlewares/appLoggerMiddleware';
import { GraphqlLoggingPlugin } from './plugins/graphqlLoggingPlugin';
import { GraphDBService } from './graphDB.service';

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
    GraphDBService,
    PersonResolver,
    SourceResolver,
    ActivityResolver,
    GraphqlLoggingPlugin,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
