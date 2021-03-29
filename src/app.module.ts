import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PersonService } from './person.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, PersonService],
})
export class AppModule {}
