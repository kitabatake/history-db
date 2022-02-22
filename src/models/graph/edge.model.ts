import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Relationship } from 'neo4j-driver-core/types/graph-types';

@ObjectType()
export class Edge {
  static createFromGraphData(rel: Relationship): Edge {
    return new Edge(
      rel.identity.toNumber(),
      rel.start.toNumber(),
      rel.end.toNumber(),
      rel.type,
    );
  }

  constructor(
    id: number,
    source: number,
    target: number,
    relationship: string,
  ) {
    this.id = id;
    this.source = source;
    this.target = target;
    this.relationship = relationship;
  }

  id: number;

  @Field((type) => Int)
  source: number;

  @Field((type) => Int)
  target: number;

  @Field()
  relationship: string;
}
