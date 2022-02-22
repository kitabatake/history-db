import { Node as Neo4jNode } from 'neo4j-driver';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Node {
  static createFromGraphNode(node: Neo4jNode): Node {
    return new Node(
      node.identity.toNumber(),
      node.properties['name'],
      node.labels[0],
    );
  }

  constructor(id: number, name: string, label: string) {
    this.id = id;
    this.name = name;
    this.label = label;
  }

  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  label: string;
}
