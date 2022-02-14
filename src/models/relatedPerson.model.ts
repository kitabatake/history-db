import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Person } from './person.model';
import { Node } from 'neo4j-driver';
import { Relationship } from 'neo4j-driver-core/types/graph-types';

@ObjectType()
export class RelatedPerson {
  static createFromGraphData(rel: Relationship, person: Node): RelatedPerson {
    return new RelatedPerson(
      rel.identity.toNumber(),
      rel.type,
      Person.createFromGraphNode(person),
    );
  }

  constructor(id: number, label: string, person: Person) {
    this.id = id;
    this.label = label;
    this.person = person;
  }

  @Field((type) => Int)
  id: number;

  @Field()
  label: string;

  @Field(() => Person)
  person: Person;
}
