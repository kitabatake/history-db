import { Body, Controller, Get, Post } from '@nestjs/common';
import { PersonService } from './person.service';
import { Person as PersonModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly personService: PersonService) {}

  @Get('persons')
  async getPublishedPosts(): Promise<PersonModel[]> {
    return this.personService.persons({});
  }

  @Post('person')
  async createPerson(
    @Body() personData: { name: string; description?: string },
  ): Promise<PersonModel> {
    const { name, description } = personData;
    return this.personService.createPerson({
      name,
      description,
    });
  }
}
