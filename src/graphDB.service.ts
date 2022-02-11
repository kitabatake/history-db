import { Driver } from 'neo4j-driver/types/driver';
import neo4j, { QueryResult } from 'neo4j-driver';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Person } from './models/person.model';

@Injectable()
export class GraphDBService implements OnModuleInit, OnModuleDestroy {
  driver: Driver;

  async onModuleInit() {
    this.driver = neo4j.driver(
      process.env.NEO4J_URL || '',
      neo4j.auth.basic(
        process.env.NEO4J_USER || '',
        process.env.NEO4J_PW || '',
      ),
    );
  }

  async onModuleDestroy() {
    await this.driver.close();
  }

  public async createPerson(
    name: string,
    description: string,
  ): Promise<Person> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        'CREATE (p:Person {name: $name, description: $description}) RETURN p',
        { name: name, description: description },
      );
    } finally {
      await session.close();
    }

    return Person.createFromGraphNode(result.records[0].get('p'));
  }

  public async getPersons(nameForSearch?: string): Promise<Person[]> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      if (nameForSearch) {
        result = await session.run(
          'MATCH (p:Person) WHERE p.name CONTAINS $nameForSearch RETURN p',
          { nameForSearch: nameForSearch },
        );
      } else {
        result = await session.run('MATCH (p:Person) RETURN p');
      }
    } finally {
      await session.close();
    }
    return result.records.map((r) => Person.createFromGraphNode(r.get('p')));
  }

  public async getPerson(id: number): Promise<Person> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        'MATCH (p:Person) WHERE ID(p) = $id RETURN p',
        { id: id },
      );
    } finally {
      await session.close();
    }
    return Person.createFromGraphNode(result.records[0].get('p'));
  }

  public async updatePerson(id: number, name: string, description: string) {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        `
          MATCH (p:Person) 
          WHERE ID(p) = $id 
          SET p.name = $name, p.description = $description
          RETURN p
         `,
        {
          id: id,
          name: name,
          description: description,
        },
      );
    } finally {
      await session.close();
    }

    return Person.createFromGraphNode(result.records[0].get('p'));
  }
}
