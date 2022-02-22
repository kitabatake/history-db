import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Relationship } from 'neo4j-driver-core/types/graph-types';

@ObjectType()
export class Edge {
  static createFromGraphData(rel: Relationship): Edge {
    return new Edge(rel.start.toNumber(), rel.end.toNumber(), rel.type);
  }

  constructor(source: number, target: number, relationship: string) {
    this.source = source;
    this.target = target;
    this.relationship = relationship;
  }

  @Field((type) => Int)
  source: number;

  @Field((type) => Int)
  target: number;

  @Field()
  relationship: string;
}
