import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Edge } from './edge.model';
import { Node } from './node.model';

@ObjectType()
export class Elements {
  @Field((type) => [Node])
  nodes: Node[];

  @Field((type) => [Edge])
  edges: Edge[];
}
