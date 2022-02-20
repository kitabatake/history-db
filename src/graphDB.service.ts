import { Driver } from 'neo4j-driver/types/driver';
import neo4j, { QueryResult } from 'neo4j-driver';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Person } from './models/person.model';
import { RelatedPerson } from './models/relatedPerson.model';
import { RelationshipDirection } from './models/RelationshipDirection';
import { Activity } from './models/activity.model';

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

  public async createActivity(
    name: string,
    description?: string,
  ): Promise<Activity> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        'CREATE (a:Activity {name: $name, description: $description}) RETURN a',
        { name: name, description: description || '' },
      );
    } finally {
      await session.close();
    }

    return Activity.createFromGraphNode(result.records[0].get('a'));
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

  public async getActivities(nameForSearch?: string): Promise<Activity[]> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      if (nameForSearch) {
        result = await session.run(
          'MATCH (a:Activity) WHERE a.name CONTAINS $nameForSearch RETURN a',
          { nameForSearch: nameForSearch },
        );
      } else {
        result = await session.run('MATCH (a:Activity) RETURN a');
      }
    } finally {
      await session.close();
    }
    return result.records.map((r) => Activity.createFromGraphNode(r.get('a')));
  }

  public async getRelatedPersons(id: number): Promise<RelatedPerson[]> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        `
          MATCH (from:Person)-[r]-(to:Person) 
          WHERE ID(from) = $id 
          RETURN r, to
         `,
        { id: id },
      );
    } finally {
      await session.close();
    }
    return result.records.map((r) =>
      RelatedPerson.createFromGraphData(r.get('r'), r.get('to')),
    );
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

  public async updatePerson(
    id: number,
    name: string,
    description: string,
  ): Promise<Person> {
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

  public async addPersonAlias(id: number, alias: string): Promise<Person> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        `
          MATCH (p:Person) 
          WHERE ID(p) = $id 
          SET p.aliases = COALESCE(p.aliases, []) + [$alias]
          RETURN p
         `,
        {
          id: id,
          alias: alias,
        },
      );
    } finally {
      await session.close();
    }

    return Person.createFromGraphNode(result.records[0].get('p'));
  }

  public async removePersonAlias(id: number, alias: string): Promise<Person> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        `
          MATCH (p:Person) 
          WHERE ID(p) = $id 
          SET p.aliases = [alias in p.aliases where alias <> $alias]
          RETURN p
         `,
        {
          id: id,
          alias: alias,
        },
      );
    } finally {
      await session.close();
    }

    return Person.createFromGraphNode(result.records[0].get('p'));
  }

  public async addPersonRelationship(
    fromId: number,
    toId: number,
    label: string,
  ): Promise<Person> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        `
          MATCH (from:Person) 
          WHERE ID(from) = $fromId 
          MATCH (to:Person) 
          WHERE ID(to) = $toId 
          CREATE (from) -[r:${label}]-> (to)
          RETURN from
         `,
        {
          fromId: fromId,
          toId: toId,
        },
      );
    } finally {
      await session.close();
    }

    return Person.createFromGraphNode(result.records[0].get('from'));
  }

  public async addPersonActivityRelationship(
    personId: number,
    activityId: number,
    label: string,
  ): Promise<Person> {
    const session = this.driver.session();
    let result: QueryResult;
    try {
      result = await session.run(
        `
          MATCH (p:Person) 
          WHERE ID(p) = $personId 
          MATCH (a:Activity) 
          WHERE ID(a) = $activityId 
          CREATE (p) -[r:${label}]-> (a)
          RETURN p
         `,
        {
          personId: personId,
          activityId: activityId,
        },
      );
    } finally {
      await session.close();
    }

    return Person.createFromGraphNode(result.records[0].get('p'));
  }

  public async deleteActivity(id: number) {
    const session = this.driver.session();
    try {
      await session.run(
        `
          MATCH (a:Activity)
          WHERE ID(a) = $id
          DELETE a
         `,
        {
          id: id,
        },
      );
    } finally {
      await session.close();
    }
  }

  public async removeRelationship(id: number) {
    const session = this.driver.session();
    try {
      await session.run(
        `
          MATCH ()-[r]-() 
          WHERE ID(r) = $id
          DELETE r
         `,
        {
          id: id,
        },
      );
    } finally {
      await session.close();
    }
  }
}
