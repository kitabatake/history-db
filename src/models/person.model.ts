import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Node } from 'neo4j-driver';

@ObjectType()
export class Person {
  static createFromGraphNode(node: Node): Person {
    return new Person(
      node.identity.toNumber(),
      node.properties['name'],
      node.properties['description'],
      node.properties['aliases'] || [],
    );
  }

  constructor(
    id: number,
    name: string,
    description: string,
    aliases: string[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.aliases = aliases;
  }

  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String])
  aliases: string[];
}
