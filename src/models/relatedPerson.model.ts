import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Person } from './person.model';
import { Node } from 'neo4j-driver';
import { Relationship } from 'neo4j-driver-core/types/graph-types';
import { RelationshipDirection } from './RelationshipDirection';

@ObjectType()
export class RelatedPerson {
  static createFromGraphData(rel: Relationship, person: Node): RelatedPerson {
    return new RelatedPerson(
      rel.identity.toNumber(),
      rel.type,
      Person.createFromGraphNode(person),
      rel.start.toNumber() == person.identity.toNumber()
        ? RelationshipDirection.INWARD
        : RelationshipDirection.OUTWARD,
    );
  }

  constructor(
    id: number,
    label: string,
    person: Person,
    direction: RelationshipDirection,
  ) {
    this.id = id;
    this.label = label;
    this.person = person;
    this.direction = direction;
  }

  @Field((type) => Int)
  id: number;

  @Field()
  label: string;

  @Field(() => Person)
  person: Person;

  @Field(() => RelationshipDirection)
  direction: RelationshipDirection;
}
