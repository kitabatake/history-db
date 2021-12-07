import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  Person as PPerson,
  PersonRelation as PPersonRelation,
} from '@prisma/client';
import { Person } from './models/person.model';
import { Args, Int } from '@nestjs/graphql';
import { PersonRelation } from './models/personRelation.model';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async findPersonById(id: number): Promise<Person | null> {
    const pPerson = await this.prisma.person.findUnique({
      where: {
        id: id,
      },
    });
    return new Person(pPerson.id, pPerson.name, pPerson.description);
  }

  async findPersons(): Promise<Person[]> {
    const pPersons = await this.prisma.person.findMany();
    return pPersons.map(
      (pPerson) => new Person(pPerson.id, pPerson.name, pPerson.description),
    );
  }

  async createPerson(name: string, description: string) {
    const pPerson = await this.prisma.person.create({
      data: {
        name: name,
        description: description,
      },
    });
    return new Person(pPerson.id, pPerson.name, pPerson.description);
  }

  async createRelation(person_ids: number[], description: string) {
    const pPersonRelation = await this.prisma.personRelation.create({
      data: {
        description: description,
        persons: {
          create: person_ids.map((id) => {
            return {
              person_id: id,
            };
          }),
        },
      },
      include: {
        persons: true,
      },
    });

    const persons: Person[] = [];
    for (const pPersonRelationPerson of pPersonRelation.persons) {
      const person = await this.prisma.person.findUnique({
        where: {
          id: pPersonRelationPerson.person_id,
        },
      });
      persons.push(person);
    }

    return new PersonRelation(
      pPersonRelation.id,
      pPersonRelation.description,
      persons,
    );
  }
}
